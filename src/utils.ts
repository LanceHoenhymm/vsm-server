/* cSpell:disable */
import admin from 'firebase-admin';
import { RequestHandler } from 'express';
import functions from 'firebase-functions';

import { DateTime } from 'luxon';

admin.initializeApp();

const trading_time = 8 * 60 * 1000;

//trading time update

const cycle = {
  trading_starts: 'trading_starts',
  trading_ends: 'trading_ends',
  price_calc_starts: 'price_calc_starts',
  price_calc_ends: 'price_calc_ends',
};

let shoudlDummySet = true;

let globalsCollectionStr = 'globals_col_d2';
let usersCollectionStr = 'users_col_d2';
let stocksCollectionStr = 'stocks_col_d2';
let newsCollectionStr = 'news_col_d2';

const globalsCollectionCol = admin.firestore().collection(globalsCollectionStr);
const usersCollectionCol = admin.firestore().collection(usersCollectionStr);
const dummyCol = admin.firestore().collection('dummy_col');
const stocksCollectionCol = admin.firestore().collection(stocksCollectionStr);
const newsCollection = admin.firestore().collection(newsCollectionStr);

const rtdb = admin.database();
const globalsRefRT = rtdb.ref('/globals_rt_d2'); // TODO accomodate these changes in the app

const initialAmount = 1000000;
const estimate_of_num_of_participants = 100;

export const addMessage: RequestHandler = async (req, res) => {
  await dummyRun2();
  res.json({ message: 'Succesfully Populated Database' });
};

export const addUser: RequestHandler = async (req, res) => {
  try {
    let dummyId = req.query.tid as string;

    usersCollectionCol.doc(dummyId).set({
      muftkapaisa_used: -999,
      balance: initialAmount,
      curr_port_value: 0,
      amt_invested: 0,
      options_used_info: -999,
      state: req.query.state,
      p1: req.query.p1,
      p2: req.query.p2,
      t_name: req.query.t_name,
      password: req.query.password,
    });

    // TODO change in volunteers app too [] stephen
    admin
      .database()
      .ref(`/dummy_teams_d2/${dummyId}/user_state`)
      .set(req.query.state);

    let docsOfStocksOfRound1 = await stocksCollectionCol
      .doc('1')
      .collection('stocks')
      .get();

    const addStocksBatches = admin.firestore().batch();

    docsOfStocksOfRound1.forEach((e) => {
      const newStkData = {
        prev_qty: 0,
        new_qty: 0,
        total_amt_invested: 0,
      };

      addStocksBatches.set(
        usersCollectionCol.doc(dummyId).collection('stocks').doc(e.id),
        newStkData,
      );
    });

    await addStocksBatches.commit();

    res.json({
      status: 1,
      message: `Team with team id ${dummyId} added successfully`,
    });
  } catch (error) {
    res.json({
      status: 0,
      message: `Failed to add team`,
      erros: `${error}`,
    });
  }
};

// CODE REVIEW:
export const findNegative: RequestHandler = async (req, res) => {
  try {
    let negativesList: Array<{
      [index: string]: admin.firestore.DocumentData;
    }> = [];
    let negsTid: Array<string> = [];

    const data = await admin
      .firestore()
      .collectionGroup('stocks')
      .where('new_qty', '<', 0)
      .get();

    if (data.empty) {
      res.json({
        status: '0',
        message: `No negative new_qty found`,
      });
      return;
    }

    data.docs.forEach((v) => {
      const docPathSegment = v.ref.path.split('/');
      negsTid.push(docPathSegment[1]);
      console.log(`Path For Negative: ${docPathSegment}`);
      const toPust = { [`${v.id}`]: v.data() };
      negativesList.push(toPust);
    });
    console.log(JSON.stringify(data));

    res.json({
      status: '1',
      negsList: negativesList,
      negsTidList: negsTid,
    });
  } catch (error) {
    res.json({
      status: '0',
      error: `${error}`,
    });
  }
};
// TODO: Code Review Ends 2

// TODO: Code Review
export const manualFixForErrorAfterTrading: RequestHandler = async (
  req,
  res,
) => {
  try {
    const data = req.body;
    const shouldOnlyPrint = data.shouldOnlyPrint;
    const pendingCommits = [];

    console.log(`Data Received: ${JSON.stringify(data)}`);

    const globalData = (
      await globalsCollectionCol.doc('globals').get()
    ).data()!;
    console.log('Global Data' + JSON.stringify(globalData));

    const userData = (
      await usersCollectionCol.doc(`${data.tid}`).get()
    ).data()!;

    const myBatch = admin.firestore().batch();

    let muserBalace = userData['balance'];

    for (const stkName in data.stk_to_update_data) {
      const stk_to_update_price = data.stk_to_update_data[stkName] as number;

      console.log(
        `Man Fix Stock Name: ${stkName} Stock Data: ${JSON.stringify(
          data.stk_to_update_data[stkName],
        )}`,
      );

      const oneStockData = (
        await usersCollectionCol
          .doc(`${data.tid}`)
          .collection('stocks')
          .doc(`${stkName}`)
          .get()
      ).data()!;

      const oneStockDataPrice = (
        await stocksCollectionCol
          .doc(`${globalData.curr_round}`)
          .collection('stocks')
          .doc(`${stkName}`)
          .get()
      ).data()?.['stk_price'] as number;

      console.log(
        `Man Fix Cloud Previous Data - Stock Name: ${stkName} Stock Data: ${JSON.stringify(
          oneStockData,
        )}`,
      );

      let mnew_qty = oneStockData['new_qty'] + stk_to_update_price;
      let price_diff = stk_to_update_price * oneStockDataPrice;
      let mtotal_amt_invested = oneStockData['total_amt_invested'] + price_diff;
      muserBalace -= price_diff;

      if (muserBalace < 0) {
        console.log(`User Balance Going Negative: ${muserBalace}`);
        throw RangeError;
      }

      myBatch.update(
        usersCollectionCol
          .doc(`${data.tid}`)
          .collection('stocks')
          .doc(`${stkName}`),
        {
          new_qty: mnew_qty,
          total_amt_invested: mtotal_amt_invested,
        },
      );

      pendingCommits.push({
        path: JSON.stringify(
          usersCollectionCol
            .doc(`${data.tid}`)
            .collection('stocks')
            .doc(`${stkName}`),
        ),
        update: {
          new_qty: mnew_qty,
          total_amt_invested: mtotal_amt_invested,
        },
      });
    }

    myBatch.update(usersCollectionCol.doc(`${data.tid}`), {
      balance: muserBalace,
    });

    pendingCommits.push({
      path: JSON.stringify(usersCollectionCol.doc(`${data.tid}`)),
      update: {
        balance: muserBalace,
      },
    });

    console.log(`${JSON.stringify(myBatch)}`);
    if (shouldOnlyPrint) {
      res.json({
        status: '1',
        message: `Didn't commit changes for ${data.tid}`,
        pendingCommits,
      });
      return;
    }

    console.log(`Starting commiting changes for ${data.tid}`);
    await myBatch.commit();
    console.log(`Finished commiting changes for ${data.tid}`);

    res.json({
      status: '1',
      message: `Finished commiting changes for ${data.tid}`,
    });
  } catch (error) {
    res.json({
      status: '0',
      message: `Error commiting changes`,
      error: `${error}`,
    });
  }
};

// TODO: Code Review Ends

export const addNews: RequestHandler = async (req, res) => {
  try {
    // doOnAddUserRequest(req, res)

    if (req.body.is_insider == 'Y') {
      await newsCollection
        .doc(`R${req.body.round_no}`)
        .collection('news')
        .doc(`IN${req.body.news_no}`)
        .set({
          news: `${req.body.news}`,
          is_insider: true,
        });
    } else {
      await newsCollection
        .doc(`R${req.body.round_no}`)
        .collection('news')
        .doc(`N${req.body.news_no}`)
        .set({
          news: `${req.body.news}`,
        });
    }

    res.json({
      status: '1',
    });
  } catch (error) {
    res.json({
      status: '0',
    });
  }
};

export const addStocks: RequestHandler = async (req, res) => {
  try {
    await stocksCollectionCol
      .doc(`${req.body.round_no}`)
      .collection('stocks')
      .doc(`${req.body.stk_name}`)
      .set({
        stk_price: Number.parseFloat(`${req.body.stk_price}`),
        bpc: Number.parseFloat(`${req.body.bpc}`),
        npc: -999,
        vol_traded: 0,
      });

    res.json({
      status: '1',
    });
  } catch (error) {
    res.json({
      status: '0',
    });
  }
};

export const makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    const original = snap.data().original;

    functions.logger.log('Uppercasing', context.params.documentId, original);

    const uppercase = original.toUpperCase();

    return snap.ref.set({ uppercase }, { merge: true });
  });

const algo = (bpc: number, vol_traded: number, stk_price: number) => {
  const max_buyable =
    ((2 * initialAmount) / stk_price) * estimate_of_num_of_participants;

  const multiplier = (bpc * -1) / max_buyable; //here issue

  const npc = bpc + multiplier * (vol_traded * (bpc > 0 ? -1.0 : 1.0));

  return npc;
};

const dummyRun2 = async () => {
  await globalsCollectionCol.doc('globals').set({
    start_time: '2020-03-18 10:10:10.123456', //
    curr_round: 1,
    dummy_run: '',
    game_state: '',
  });

  await globalsRefRT.update({
    game_state_rt: 'WaitingForGameStart',
  });
};

export const onDummyChanged3 = functions.firestore
  .document('/dummy_col/test')
  .onWrite(() => {
    dummyRun2();
  });

const getWhatChanged = (
  snap: functions.Change<functions.firestore.DocumentSnapshot>,
) => {
  const whatChanged: { [field: string]: string } = {};
  const before = snap.before.data()!;
  const after = snap.after.data()!;

  for (const item in before) {
    if (before[item] != after[item]) {
      whatChanged[item] = after[item];
    }
  }

  console.log(`What Changed: ${JSON.stringify(whatChanged)}`);

  return whatChanged;
};

const toDoIfStateChanged = async (
  snap: functions.Change<functions.firestore.DocumentSnapshot>,
) => {
  //trading starts

  const state = snap.after.data()!.game_state;

  switch (state) {
    case 'trading_starts':
      const dateStr = DateTime.local().toLocaleString();

      await globalsCollectionCol.doc('globals').update({
        start_time: dateStr,
      });

      globalsRefRT.update({
        game_state_rt: 'TradingStarts',
      });

      setTimeout(() => {
        globalsCollectionCol.doc('globals').update({
          game_state: 'trading_ends',
        });

        globalsRefRT.set({
          game_state_rt: 'TradingEnds',
        });
      }, trading_time);
      break;
    case 'trading_ends':
      break;
    case 'price_calc_starts':
      // starts from here
      let globalData = snap.after.data()!;

      ///Take current round here
      let currRound = globalData.curr_round;

      /// Getting all user data here
      let allUserData = await usersCollectionCol.get();

      // const allUserUpdatesbatch = admin.firestore().batch();

      /// Taking stocks for single round
      let multipleStockDataForCurrentRoundVa1 = await stocksCollectionCol
        .doc(currRound)
        .collection('stocks')
        .get();

      let stocksForCurrRoundData: { [id: string]: any } = {};

      multipleStockDataForCurrentRoundVa1.docs.forEach((e) => {
        let key = e.id;
        let value = e.data();
        stocksForCurrRoundData[key] = value;

        console.log(`stock ${key} | stock data ${value}`);
      });

      const userid_stkname_new_qty = {};

      /// Iterate through all users data
      for (const e of allUserData.docs) {
        let tid = e.id;
        let singleUserData = e.data();

        // ye point pe balance kata kya?
        console.log(
          `User Data Round Number: ${currRound} Tid: ${tid} User Data: ${JSON.stringify(
            singleUserData,
          )}`,
        );

        if (
          singleUserData.muftkapaisa_used != -999 &&
          singleUserData.muftkapaisa_used.round_used_at == currRound
        ) {
          // add await here 852 tanishq [] , Darshil 853 [v],

          //redeploy
          await usersCollectionCol.doc(tid).update({
            balance: singleUserData.balance - initialAmount,
          });
        }

        if (
          singleUserData.options_used_info != -999 &&
          singleUserData.options_used_info.round_used_at == currRound &&
          singleUserData.options_used_info.used_on_stk_name != '-999'
        ) {
          // if (
          //   singleUserData.options_used_info != -999 &&
          //   singleUserData.options_used_info.round_used_at == currRound &&
          //   singleUserData.options_used_info.used_on_stk_name != "-999"
          // )

          //
          let stk_data_for_apt_round = await stocksCollectionCol
            .doc(String(currRound))
            .collection('stocks')
            .doc(singleUserData.options_used_info.used_on_stk_name)
            .get();
          stk_data_for_apt_round = stk_data_for_apt_round.data();

          if (stk_data_for_apt_round.bpc <= 0) {
            let theOptionedStockInSingleUserData = await usersCollectionCol
              .doc(tid)
              .collection('stocks')
              .doc(singleUserData.options_used_info.used_on_stk_name)
              .get();

            theOptionedStockInSingleUserData =
              theOptionedStockInSingleUserData.data();

            const diffAmt =
              (theOptionedStockInSingleUserData['new_qty'] -
                theOptionedStockInSingleUserData['prev_qty']) *
              stk_data_for_apt_round['stk_price'];

            await usersCollectionCol.doc(tid).update({
              balance: singleUserData.balance + diffAmt,
            });

            let new_amt_invested =
              theOptionedStockInSingleUserData['total_amt_invested'] - diffAmt;

            await usersCollectionCol
              .doc(tid)
              .collection('stocks')
              .doc(singleUserData.options_used_info.used_on_stk_name)
              .update({
                // stk_name: theOptionedStockInSingleUserData["prev_qty"],
                new_qty: theOptionedStockInSingleUserData['prev_qty'],
                total_amt_invested: new_amt_invested,
              });
          } else {
          }
        }

        let stocksOfParticularUser = await usersCollectionCol
          .doc(tid)
          .collection('stocks')
          .get();

        let stocksOfOneUserData = {};
        stocksOfParticularUser.docs.forEach((e) => {
          let key = e.id;
          let value2 = e.data();
          stocksOfOneUserData[key] = value2;
        });

        const oneUserBatchForStockQty = admin.firestore().batch();

        /// Iterating throught stock of one user

        // why zero //come here again 2203[]
        userid_stkname_new_qty[tid] = {
          amt_invested: 0, //previous se fetch karo
          curr_port_value: 0,
        };

        for (const [stockName, value2] of Object.entries(stocksOfOneUserData)) {
          console.log(
            `We can have checks here for the negative case Tid: ${tid} Stock Name: ${stockName} Stock Details: ${JSON.stringify(
              value2,
            )}`,
          );

          stocksForCurrRoundData[stockName].vol_traded +=
            value2.new_qty - value2.prev_qty;

          let cumulative_investment = (userid_stkname_new_qty[
            tid
          ].amt_invested += value2.total_amt_invested); // calculating total_amt_invested incorrectly

          // userid_stkname_new_qty[tid] = {
          //   amt_invested: cumulative_investment,
          // };

          // userid_stkname_new_qty[tid]["amt_invested"] += cumulative_investment; //check this[]
          userid_stkname_new_qty[tid]['amt_invested'] = cumulative_investment; //check this[]

          userid_stkname_new_qty[tid][stockName] = value2.new_qty;

          //
          // allUserUpdatesbatch.update(
          //   usersCollectionCol.doc(tid).collection("stocks").doc(stockName),
          //   {
          //     prev_qty: value2.new_qty,
          //   }
          // );

          // allUserUpdatesbatch.update(usersCollectionCol.doc(tid), {
          //   amt_invested: userid_stkname_new_qty[tid][""],
          // });

          //come here 1600[]
          oneUserBatchForStockQty.update(
            usersCollectionCol.doc(tid).collection('stocks').doc(stockName),
            {
              prev_qty: value2.new_qty,
              // total_amt_invested: value2.total_amt_invested //this is new []
              total_amt_invested: value2.total_amt_invested,
            },
          );
        }

        await oneUserBatchForStockQty.commit(); // [] should await or not
      }

      /**
       * Now,
       *
       * Iterate through the stock list
       * Calculate and set npc = alog(bpc, vol_traded)
       */

      /// Iterating through stocks of current round

      //isme tid acc me mat
      for (const [stockName, value] of Object.entries(stocksForCurrRoundData)) {
        stocksForCurrRoundData[stockName].npc = algo(
          value.bpc,
          value.vol_traded,
          value.stk_price,
        );

        let nextRound = currRound + 1;

        const newStkPrice =
          stocksForCurrRoundData[stockName].stk_price *
          (1 + stocksForCurrRoundData[stockName].npc / 100);

        // userid_stkname_new_qty[tid]
        for (const [tid, value] of Object.entries(userid_stkname_new_qty)) {
          let stkqty = userid_stkname_new_qty[tid][stockName];

          //what to do?
          //testlog

          if (stkqty == undefined) {
            continue;
          }

          //   ` ${tid} for stkname ${stockName} newstkprice is ${newStkPrice} stkqty is ${stkqty}`
          // );

          userid_stkname_new_qty[tid]['curr_port_value'] +=
            newStkPrice * stkqty;

          //

          //
          //
          // //
          //
          // batch.update(usersCollectionCol.doc(tid), {
          //   amt_invested: value["amt_invested"],
          //   curr_port_value: value["curr_port_value"],
          // });
        }

        stocksCollectionCol
          .doc(String(nextRound))
          .collection('stocks')
          .doc(stockName)
          .update({ stk_price: newStkPrice });
      }

      const batch = admin.firestore().batch();
      const base = stocksCollectionCol
        .doc(String(currRound))
        .collection('stocks');

      for (const [key, value] of Object.entries(stocksForCurrRoundData)) {
        batch.update(base.doc(key), value);
      }

      for (const [tid, value] of Object.entries(userid_stkname_new_qty)) {
        //

        let checkIsNan = isNaN(value['curr_port_value']);

        //

        batch.update(usersCollectionCol.doc(tid), {
          amt_invested: value['amt_invested'],
          curr_port_value: checkIsNan ? 0 : value['curr_port_value'],
        });
      }

      await batch.commit();

      await globalsCollectionCol.doc('globals').update({
        game_state: 'price_calc_manual_verification',
        // curr_round: currRound + 1,
      });

      break;
    case 'price_calc_ends':
      let nextRound =
        (await globalsCollectionCol.doc('globals').get()).data()?.curr_round +
        1;

      await globalsCollectionCol.doc('globals').update({
        curr_round: nextRound,
      }); // [] waiting for next round to be set before updating the state of globalsRefRt

      globalsRefRT.update({
        game_state_rt: 'PriceCalcEnds',
      });

      break;
    default:
      break;
  }
};

export const onGlobalChanged = functions.firestore
  .document(`${globalsCollectionStr}/globals`)
  .onWrite(async (snap, context) => {
    //change to dummy run field add kar ad do it
    let whatChanged = getWhatChanged(snap);
    if ('game_state' in whatChanged) {
      toDoIfStateChanged(snap);
    } else if ('dummy_run' in whatChanged) {
      dummyRun2();
    }
  });
