import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PurchaseInquiry {
    name: string;
    email: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface backendInterface {
    checkSubmitted(email: string): Promise<boolean>;
    getAllInquiries(): Promise<Array<PurchaseInquiry>>;
    submitInquiry(name: string, email: string, phone: string): Promise<void>;
}
