import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    role: string;
}
export interface backendInterface {
    addMessage(sessionId: string, role: string, content: string): Promise<void>;
    clearHistory(sessionId: string): Promise<void>;
    getHistory(sessionId: string): Promise<Array<Message>>;
}
