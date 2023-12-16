/* cSpell:disable */
import admin from 'firebase-admin';
import { RequestHandler } from 'express';
const functions = require('firebase-functions');
// const admin = require('firebase-admin');
const { user } = require('firebase-functions/v1/auth');

import { DateTime } from 'luxon';

admin.initializeApp();

// const trading_time = 30 * 1000;
// const trading_time = 60 * 1000; // trading time of 1
// const trading_time = 2 * 60 * 1000; // trading time of 1 //[dummy]
// const trading_time = 59 * 60 * 1000; // trading time of 1 //[dummy]
// const trading_time = 5 * 60 * 1000; // trading time of 1 //[dummy]
// const trading_time = 2 * 60 * 1000; // trading time of 1 //[dummy] ///
// const trading_time = 5 * 60 * 1000; // trading time of 1 //[dummy] ///
const trading_time = 8 * 60 * 1000; // trading time of 1 //[dummy] ///
// const trading_time = 2 * 60 * 1000; // trading time of 1 //[ ] ///

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

export const addMessage: RequestHandler = async (req, res) => {
  await dummyRun2();
  res.json({ message: 'Succesfully Populated Database' });

  return;

  // try {
  //   const original = req.query.text;

  //   const writeResult = await admin.firestore().collection('message').add({
  //     original: original,
  //   });
  //   res.json({ result: `Message with ID: ${writeResult.id} added.` });
  // } catch (e) {
  //   res.json({ error: e });
  // }
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

    admin
      .database()
      // .ref(`/dummy_teams/${dummyId}/user_state`)
      // .ref(`/dummy_teams_d2/${dummyId}/user_state`) // TODO change in volunteers app too [] stephen
      .ref(`/dummy_teams_d2/${dummyId}/user_state`) // TODO change in volunteers app too [] stephen

      // .set("WaitingForReg");
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
    // let negs =
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
    // data = data.docs;
    data.docs.forEach((v) => {
      const docPathSegment = v.ref.path.split('/');
      negsTid.push(docPathSegment[1]);
      console.log(`Path For Negative: ${docPathSegment}`);
      const toPust = { [`${v.id}`]: v.data() };
      // toPust[v.id] = v.data();
      negativesList.push(toPust);
    });
    console.log(JSON.stringify(data));

    res.json({
      status: '1',
      // message: `${JSON.stringify(negativesList)}`,
      // message: `${JSON.stringify(negativesList)}`,
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

      // let mnew_qty = oneStockData["new_qty"] + stk_data["qty_diff"];
      let mnew_qty = oneStockData['new_qty'] + stk_to_update_price;
      // let price_diff = stk_data["qty_diff"] * oneStockDataPrice;
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
    // let t = Number.parseFloat()
    // let t = Number.parseInt
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

exports.makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    const original = snap.data().original;

    functions.logger.log('Uppercasing', context.params.documentId, original);

    const uppercase = original.toUpperCase();

    return snap.ref.set({ uppercase }, { merge: true });
  });

const db = admin.firestore().collection('game_db');
const stocksTable = db.doc('stocks');

const usersTable = db.doc('users');
const globalTable = db.doc('globals');

const rtdb = admin.database();

// const globalsRefRT = rtdb.ref("/globals_rt");
const globalsRefRT = rtdb.ref('/globals_rt_d2'); // TODO accomodate these changes in the app

const getStockInfoFromStockDB = async (stk_name) => {
  var data = await stocksTable.get();
  data = data.data()[stk_name];

  return data;
};

// const executeOptions = async (user_data, uid) => {
//

//   const theStock = user_data["options_used_info"]["used_on_stk_name"];
//   const stk_info = await getStockInfoFromStockDB(theStock);
//
//
//   const next_stk_price = stk_info["stk_price"];
//   const prev_stk_price = stk_info["prev_stk_price"];

//   if (prev_stk_price > next_stk_price) {
//
//
//     const diffAmt =
//       (user_data.stks[theStock].qty - user_data.options_used_info.prev_qty) *
//       prev_stk_price;

//     user_data.balance += diffAmt;
//     user_data.stks[theStock].total_amt_invested -= diffAmt;

//

//     user_data.qty = user_data.options_used_info.prev_qty;

//     const toupdate = {};
//     toupdate[uid] = user_data;

//     const res = await usersTable.update(toupdate);

//     const test = await db.doc("users", uid).get();
//
//

//     const resRead = await usersTable.get();
//
//   }
// };

const initialAmount = 1000000;
// const estimate_of_num_of_participants = 100;
// const estimate_of_num_of_participants = 50; //change in production[]

const estimate_of_num_of_participants = 100; //change in production[]

const algo = (bpc, vol_traded, stk_price) => {
  let max_buyable =
    // (initialAmount / stk_price) * estimate_of_num_of_participants;
    ((2 * initialAmount) / stk_price) * estimate_of_num_of_participants;

  //[] test this estimate_of_num_of_participants;

  let multiplier = (bpc * -1) / max_buyable; //here issue

  // -10 / 26666 = -0.00375

  let npc = bpc + multiplier * (vol_traded * (bpc > 0 ? -1.0 : 1.0));

  // 10 + -0.00375*-639 =>more pos

  // -7 + +0.003*+678 => less negative

  //-ve + +ve * +ve = less negative [v]
  // negative
  // let npc = bpc + multiplier * vol_traded; //-ve + +ve * -ve = more negative [v]
  // let npc = bpc + multiplier * vol_traded; //+ve + -ve * -ve = more positive [v] //bullish in +ve bpc
  // let npc = bpc + multiplier * vol_traded; //+ve + -ve * +ve = less positive [v] //bearish in +ve bpc

  return npc;
};

const dummyRun2 = async () => {
  // todo stk["prev_qty"]
  // todo stk["new_qty"]

  // for this.
  //
  // return;
  //
  // let req = {

  //   query: { tid: "567788990", p1: "", p2: "", password: "", t_name: "" },
  // };

  // let res = {
  //   json: (e) => {
  //
  //   },
  // };

  // await doOnAddUserRequest(req, res);

  // let req2 = {
  //   query: { tid: "test1", p1: "", p2: "", password: "", t_name: "" },
  // };

  // let res2 = {
  //   json: (e) => {
  //
  //   },
  // };

  // await doOnAddUserRequest(req2, res2);

  // req2 = {
  //   query: { tid: "test2", p1: "", p2: "", password: "", t_name: "" },
  // };

  // res2 = {
  //   json: (e) => {
  //
  //   },
  // };

  // await doOnAddUserRequest(req2, res2);

  // req2 = {
  //   query: { tid: "811", p1: "", p2: "", password: "811", t_name: "" },
  // };

  // res2 = {
  //   json: (e) => {
  //
  //   },
  // };

  // await doOnAddUserRequest(req2, res2);

  // no not this
  // globalsRefRT.set({
  //   game_state_rt: "waiting_for_game_start_rt",
  // });
  //

  // set the start time dynamically

  await globalsCollectionCol.doc('globals').set({
    start_time: '2020-03-18 10:10:10.123456', //
    curr_round: 1,
    dummy_run: '',
    game_state: '',
  });

  await globalsRefRT.update({
    game_state_rt: 'WaitingForGameStart',
  });

  return; //for production too []

  // stocksCollectionCol.doc('1').collection('stocks').doc('stk1').set({
  //   stk_price: 101,
  //   bpc: -10,
  //   npc: -999,
  //   vol_traded: 0,
  // });
  // stocksCollectionCol.doc('1').collection('stocks').doc('stk2').set({
  //   stk_price: 101,
  //   bpc: -10,
  //   npc: -999,
  //   vol_traded: 0,
  // });

  // stocksCollectionCol.doc('2').collection('stocks').doc('stk1').set({
  //   stk_price: 101,
  //   bpc: -10,
  //   npc: -999,
  //   vol_traded: 0,
  // });
  // stocksCollectionCol.doc('2').collection('stocks').doc('stk2').set({
  //   stk_price: 101,
  //   bpc: -10,
  //   npc: -999,
  //   vol_traded: 0,
  // });
  // stocksCollectionCol.doc('3').collection('stocks').doc('stk2').set({
  //   stk_price: 101,
  //   bpc: -10,
  //   npc: -999,
  //   vol_traded: 0,
  // });
  // stocksCollectionCol.doc('3').collection('stocks').doc('stk1').set({
  //   stk_price: 101,
  //   bpc: -10,
  //   npc: -999,
  //   vol_traded: 0,
  // });

  // const userData = {
  //   state: 'Playing',
  //   options_used_info: {
  //     prev_qty: 100,
  //     round_used_at: 2,
  //     used_on_stk_name: 'stk1',
  //   },
  //   balance: 1000,
  //   stks: {
  //     stk1: {
  //       new_qty: 600,
  //       prev_qty: 500,

  //       total_amt_invested: 2000,
  //     },
  //   },
  // };

  // newsCollection.doc('R1').collection('news').doc('N1').set({
  //   news: 'Over 50 smallcaps fall up to 22% as market ends week 2% down Foreign institutional investors were net sellers this week, selling equities worth Rs 7,953.66 crore. Domestic institutional investors, however, undid the damage as they bought shares worth Rs 9,233.05 crore',
  // });

  // newsCollection.doc('R1').collection('news').doc('N2').set({
  //   news: 'Track volume PCR, trade of short-term sentiments: Shubham Agarwal Volume PCR compares Put volume with Call volume. The ratio will be higher if Put Volume is more and lower if Call volume is more.',
  // });

  // newsCollection.doc('R2').collection('news').doc('N1').set({
  //   news: 'lorem ipsum r21',
  // });

  // newsCollection.doc('R2').collection('news').doc('N2').set({
  //   news: 'lorem ipsum r22',
  // });

  // newsCollection.doc('R2').collection('news').doc('IN1').set({
  //   news: 'lorem ipsum r22',
  //   is_insider_news: true,
  // });

  // newsCollection.doc('R1').collection('news').doc('IN1').set({
  //   news: 'lorem ipsum r22',
  //   is_insider_news: true,
  // });

  // usersCollectionCol.doc('123').set({
  //   muftkapaisa_used: -999,
  //   balance: initialAmount,
  //   options_used_info: -999,
  //   state: 'Playing',
  //   p1: 'req.query.p1',
  //   p2: 'req.query.p2',
  //   t_name: 'req.query.t_name',
  //   password: '123',
  // });

  // usersCollectionCol
  //   .doc('123')
  //   .collection('stocks')
  //   .doc('stk1')
  //   .set({
  //     new_qty: 500,
  //     prev_qty: 500,

  //     total_amt_invested: 500 * 100,
  //   });

  // usersCollectionCol
  //   .doc('123')
  //   .collection('stocks')
  //   .doc('stk2')
  //   .set({
  //     new_qty: 500,
  //     prev_qty: 500,
  //     total_amt_invested: 500 * 100,
  //   });

  // globalsRefRT.update({
  //   game_state_rt: 'WaitingForGameStart',
  // });

  // return;
  // const dummyId = '123';
  // const dummyId2 = '456';
  // const dummyId3 = '089';

  // const toSet = {};
  // toSet[dummyId] = userData;
  // toSet[dummyId2] = {
  //   state: 'Playing',
  //   options_used_info: -999,
  //   balance: 1000,
  //   stks: {
  //     stk1: {
  //       new_qty: 100,
  //       prev_qty: 500,
  //       total_amt_invested: 2000,
  //     },
  //   },
  // };

  // toSet[dummyId3] = {
  //   state: 'Playing',
  //   options_used_info: {
  //     prev_qty: 100,
  //     round_used_at: 1,
  //     used_on_stk_name: 'stk1',
  //   },
  //   balance: 1000,
  //   stks: {
  //     stk1: {
  //       new_qty: 1000,
  //       prev_qty: 500,
  //       total_amt_invested: 2000,
  //     },
  //   },
  // };

  // usersCollectionCol.doc(dummyId).set({
  //   muftkapaisa_used: {
  //     round_used_at: '2',
  //   },
  //   balance: 1000,
  //   options_used_info: -999,
  //   state: 'playing',
  //   p1: 'player_1_name',
  //   p2: 'player_1_name',
  //   t_name: 'team_name',
  // });

  // usersCollectionCol
  //   .doc(dummyId)
  //   .collection('stocks')
  //   .doc('stk1')
  //   .set(toSet[dummyId]['stks']['stk1']);

  // usersCollectionCol.doc(dummyId).collection('stocks').doc('stk2').set({
  //   new_qty: 7000,
  //   prev_qty: 500,
  //   total_amt_invested: 2000,
  // });

  // usersCollectionCol.doc(dummyId2).set({
  //   balance: 1000,
  //   muftkapaisa_used: -999,
  //   options_used_info: {
  //     round_used_at: '2',
  //     used_on_stk_name: 'stk2',
  //   },
  //   state: 'playing',
  //   p1: 'player_1_name',
  //   p2: 'player_1_name',
  //   t_name: 'team_name',
  // });

  // usersCollectionCol
  //   .doc(dummyId2)
  //   .collection('stocks')
  //   .doc('stk1')
  //   .set(toSet[dummyId2]['stks']['stk1']);

  // usersCollectionCol.doc(dummyId2).collection('stocks').doc('stk2').set({
  //   new_qty: 7000,
  //   prev_qty: 500,
  //   total_amt_invested: 2000,
  // });

  // let test = await newsCollection
  //   .doc('R2')
  //   .collection('news')
  //   .where('is_insider_news', '==', true)
  //   .get();

  // for (let n of test.docs) {
  // }
};

exports.onDummyChanged3 = functions.firestore
  .document('/dummy_col/test')
  .onWrite(() => {
    dummyRun2();
  });

const getWhatChanged = (snap) => {
  const whatChanged = {};
  for (const item in snap.before.data()) {
    if (snap.after.data()[item] != snap.before.data()[item]) {
      whatChanged[item] = snap.after.data()[item];
    }
  }

  console.log(`What Changed: ${JSON.stringify(whatChanged)}`);

  return whatChanged;
};

const toDoIfStateChanged = async (snap) => {
  //trading starts

  const state = snap.after.data().game_state;

  switch (state) {
    case 'trading_starts':
      let dateStr = DateTime.now()
        .setZone('Asia/Kolkata')
        .toISO()
        .split('.')[0];

      // let mdate = new Date();
      // mdate.chang
      // // mdate.getTime()
      //
      //
      //
      //

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

      let globalData = snap.after.data();

      ///Take current round here
      let currRound = globalData.curr_round;

      /// Getting all user data here
      let allUserData = await usersCollectionCol.get();

      // const allUserUpdatesbatch = admin.firestore().batch();

      /// Taking stocks for single round
      let multipleStockDataForCurrentRoundVa1 = await stocksCollectionCol
        .doc(String(currRound))
        .collection('stocks')
        .get();

      let stocksForCurrRoundData = {};

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

    case 'price_calc_ends': //
      //update next round

      // [] this changed to avoid dirty next round details

      // globalsRefRT.update({
      //   game_state_rt: "PriceCalcEnds",
      // });

      // let nextRound = await globalsCollectionCol.doc("globals").get();
      // nextRound = nextRound.data().curr_round + 1;

      // globalsCollectionCol.doc("globals").update({
      //   curr_round: nextRound,
      // });

      let nextRound = await globalsCollectionCol.doc('globals').get();
      nextRound = nextRound.data().curr_round + 1;

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

exports.onGlobalChanged = functions.firestore
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
