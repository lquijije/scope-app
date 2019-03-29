import { IUser } from '../models/user';
import { ISuperChain } from '../models/super-chain';
import { ISuperStore } from '../models/super-store';
import { IOrderStatus } from '../models/order-status';
import { ISkuOrder } from '../models/sku-order';

export interface IWorkOrder {
    id?: string;
    numero?: string;
    cadena?: ISuperChain;
    local?: ISuperStore;
    mercaderista?: IUser;
    visita?: Date;
    sku?: ISkuOrder[];
    estado: IOrderStatus;
}