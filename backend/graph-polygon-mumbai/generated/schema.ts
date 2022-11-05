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

export class ActivePromise extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ActivePromise entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ActivePromise must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ActivePromise", id.toString(), this);
    }
  }

  static load(id: string): ActivePromise | null {
    return changetype<ActivePromise | null>(store.get("ActivePromise", id));
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

  get partyTwitterHandles(): Array<string> {
    let value = this.get("partyTwitterHandles");
    return value!.toStringArray();
  }

  set partyTwitterHandles(value: Array<string>) {
    this.set("partyTwitterHandles", Value.fromStringArray(value));
  }

  get partyAddresses(): Array<Bytes> {
    let value = this.get("partyAddresses");
    return value!.toBytesArray();
  }

  set partyAddresses(value: Array<Bytes>) {
    this.set("partyAddresses", Value.fromBytesArray(value));
  }

  get createdAt(): BigInt | null {
    let value = this.get("createdAt");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set createdAt(value: BigInt | null) {
    if (!value) {
      this.unset("createdAt");
    } else {
      this.set("createdAt", Value.fromBigInt(<BigInt>value));
    }
  }

  get updatedAt(): BigInt | null {
    let value = this.get("updatedAt");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set updatedAt(value: BigInt | null) {
    if (!value) {
      this.unset("updatedAt");
    } else {
      this.set("updatedAt", Value.fromBigInt(<BigInt>value));
    }
  }
}

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

  get partyTwitterHandles(): Array<string> {
    let value = this.get("partyTwitterHandles");
    return value!.toStringArray();
  }

  set partyTwitterHandles(value: Array<string>) {
    this.set("partyTwitterHandles", Value.fromStringArray(value));
  }

  get partyAddresses(): Array<Bytes> {
    let value = this.get("partyAddresses");
    return value!.toBytesArray();
  }

  set partyAddresses(value: Array<Bytes>) {
    this.set("partyAddresses", Value.fromBytesArray(value));
  }

  get blockTimestamp(): BigInt | null {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt | null) {
    if (!value) {
      this.unset("blockTimestamp");
    } else {
      this.set("blockTimestamp", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class ParticipantAdded extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ParticipantAdded entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ParticipantAdded must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ParticipantAdded", id.toString(), this);
    }
  }

  static load(id: string): ParticipantAdded | null {
    return changetype<ParticipantAdded | null>(
      store.get("ParticipantAdded", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contractAddress(): Bytes {
    let value = this.get("contractAddress");
    return value!.toBytes();
  }

  set contractAddress(value: Bytes) {
    this.set("contractAddress", Value.fromBytes(value));
  }

  get participantName(): string {
    let value = this.get("participantName");
    return value!.toString();
  }

  set participantName(value: string) {
    this.set("participantName", Value.fromString(value));
  }

  get participantTwitterHandle(): string {
    let value = this.get("participantTwitterHandle");
    return value!.toString();
  }

  set participantTwitterHandle(value: string) {
    this.set("participantTwitterHandle", Value.fromString(value));
  }

  get participantAddress(): Bytes {
    let value = this.get("participantAddress");
    return value!.toBytes();
  }

  set participantAddress(value: Bytes) {
    this.set("participantAddress", Value.fromBytes(value));
  }
}

export class TwitterVerifiedUser extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TwitterVerifiedUser entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TwitterVerifiedUser must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TwitterVerifiedUser", id.toString(), this);
    }
  }

  static load(id: string): TwitterVerifiedUser | null {
    return changetype<TwitterVerifiedUser | null>(
      store.get("TwitterVerifiedUser", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get twitterHandles(): Array<string> {
    let value = this.get("twitterHandles");
    return value!.toStringArray();
  }

  set twitterHandles(value: Array<string>) {
    this.set("twitterHandles", Value.fromStringArray(value));
  }

  get verifiedAt(): BigInt | null {
    let value = this.get("verifiedAt");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set verifiedAt(value: BigInt | null) {
    if (!value) {
      this.unset("verifiedAt");
    } else {
      this.set("verifiedAt", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class TwitterAddVerifiedSuccessful extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save TwitterAddVerifiedSuccessful entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TwitterAddVerifiedSuccessful must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TwitterAddVerifiedSuccessful", id.toString(), this);
    }
  }

  static load(id: string): TwitterAddVerifiedSuccessful | null {
    return changetype<TwitterAddVerifiedSuccessful | null>(
      store.get("TwitterAddVerifiedSuccessful", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get twitterHandle(): string {
    let value = this.get("twitterHandle");
    return value!.toString();
  }

  set twitterHandle(value: string) {
    this.set("twitterHandle", Value.fromString(value));
  }
}
