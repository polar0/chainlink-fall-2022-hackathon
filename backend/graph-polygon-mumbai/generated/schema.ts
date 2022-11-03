// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class PromiseContractCreated extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save PromiseContractCreated entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type PromiseContractCreated must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("PromiseContractCreated", id.toString(), this);
    }
  }

  static load(id: string): PromiseContractCreated | null {
    return changetype<PromiseContractCreated | null>(
      store.get("PromiseContractCreated", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value!.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get contractAddress(): Bytes {
    let value = this.get("contractAddress");
    return value!.toBytes();
  }

  set contractAddress(value: Bytes) {
    this.set("contractAddress", Value.fromBytes(value));
  }

  get promiseName(): string {
    let value = this.get("promiseName");
    return value!.toString();
  }

  set promiseName(value: string) {
    this.set("promiseName", Value.fromString(value));
  }

  get ipfsCid(): string {
    let value = this.get("ipfsCid");
    return value!.toString();
  }

  set ipfsCid(value: string) {
    this.set("ipfsCid", Value.fromString(value));
  }

  get partyNames(): Array<string> {
    let value = this.get("partyNames");
    return value!.toStringArray();
  }

  set partyNames(value: Array<string>) {
    this.set("partyNames", Value.fromStringArray(value));
  }

  get partyTwitterHandles(): Array<string> | null {
    let value = this.get("partyTwitterHandles");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set partyTwitterHandles(value: Array<string> | null) {
    if (!value) {
      this.unset("partyTwitterHandles");
    } else {
      this.set(
        "partyTwitterHandles",
        Value.fromStringArray(<Array<string>>value)
      );
    }
  }

  get partyAddresses(): Array<Bytes> {
    let value = this.get("partyAddresses");
    return value!.toBytesArray();
  }

  set partyAddresses(value: Array<Bytes>) {
    this.set("partyAddresses", Value.fromBytesArray(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }
}
