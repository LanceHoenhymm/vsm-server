import type { ReqHandler } from '../../types';
import { IBuySellDto } from './game.controller.dto.js';

type BuySellHandler = ReqHandler<IBuySellDto>;

export const buyStockHandler: BuySellHandler = async function (req, res) {};

export const sellStockHandler: BuySellHandler = async function (req, res) {};
