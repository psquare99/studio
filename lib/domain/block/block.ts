import type { BlockId } from "./block-id";
import type { BlockType } from "./block-type";

export interface Block<TData> {
  readonly id: BlockId;
  readonly type: BlockType;
  readonly data: TData;
}