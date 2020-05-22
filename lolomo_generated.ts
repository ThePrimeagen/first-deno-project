// automatically generated by the FlatBuffers compiler, do not modify

import { flatbuffers } from "./flatbuffers"
/**
 * @constructor
 */
export namespace DenoTest{
export class Video {
  bb: flatbuffers.ByteBuffer|null = null;

  bb_pos:number = 0;
/**
 * @param number i
 * @param flatbuffers.ByteBuffer bb
 * @returns Video
 */
__init(i:number, bb:flatbuffers.ByteBuffer):Video {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param flatbuffers.ByteBuffer bb
 * @param Video= obj
 * @returns Video
 */
static getRootAsVideo(bb:flatbuffers.ByteBuffer, obj?:Video):Video {
  return (obj || new Video()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param flatbuffers.ByteBuffer bb
 * @param Video= obj
 * @returns Video
 */
static getSizePrefixedRootAsVideo(bb:flatbuffers.ByteBuffer, obj?:Video):Video {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Video()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param flatbuffers.Encoding= optionalEncoding
 * @returns string|Uint8Array|null
 */
title():string|null
title(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
title(optionalEncoding?:any):string|Uint8Array|null {
  var offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @returns number
 */
rating():number {
  var offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readInt32(this.bb_pos + offset) : 0;
};

/**
 * @param flatbuffers.Builder builder
 */
static startVideo(builder:flatbuffers.Builder) {
  builder.startObject(2);
};

/**
 * @param flatbuffers.Builder builder
 * @param flatbuffers.Offset titleOffset
 */
static addTitle(builder:flatbuffers.Builder, titleOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, titleOffset, 0);
};

/**
 * @param flatbuffers.Builder builder
 * @param number rating
 */
static addRating(builder:flatbuffers.Builder, rating:number) {
  builder.addFieldInt32(1, rating, 0);
};

/**
 * @param flatbuffers.Builder builder
 * @returns flatbuffers.Offset
 */
static endVideo(builder:flatbuffers.Builder):flatbuffers.Offset {
  var offset = builder.endObject();
  return offset;
};

static createVideo(builder:flatbuffers.Builder, titleOffset:flatbuffers.Offset, rating:number):flatbuffers.Offset {
  Video.startVideo(builder);
  Video.addTitle(builder, titleOffset);
  Video.addRating(builder, rating);
  return Video.endVideo(builder);
}
}
}
/**
 * @constructor
 */
export namespace DenoTest{
export class List {
  bb: flatbuffers.ByteBuffer|null = null;

  bb_pos:number = 0;
/**
 * @param number i
 * @param flatbuffers.ByteBuffer bb
 * @returns List
 */
__init(i:number, bb:flatbuffers.ByteBuffer):List {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param flatbuffers.ByteBuffer bb
 * @param List= obj
 * @returns List
 */
static getRootAsList(bb:flatbuffers.ByteBuffer, obj?:List):List {
  return (obj || new List()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param flatbuffers.ByteBuffer bb
 * @param List= obj
 * @returns List
 */
static getSizePrefixedRootAsList(bb:flatbuffers.ByteBuffer, obj?:List):List {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new List()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param number index
 * @param DenoTest.Video= obj
 * @returns DenoTest.Video
 */
videos(index: number, obj?:DenoTest.Video):DenoTest.Video|null {
  var offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new DenoTest.Video()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
};

/**
 * @returns number
 */
videosLength():number {
  var offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @param flatbuffers.Builder builder
 */
static startList(builder:flatbuffers.Builder) {
  builder.startObject(1);
};

/**
 * @param flatbuffers.Builder builder
 * @param flatbuffers.Offset videosOffset
 */
static addVideos(builder:flatbuffers.Builder, videosOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, videosOffset, 0);
};

/**
 * @param flatbuffers.Builder builder
 * @param Array.<flatbuffers.Offset> data
 * @returns flatbuffers.Offset
 */
static createVideosVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (var i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]);
  }
  return builder.endVector();
};

/**
 * @param flatbuffers.Builder builder
 * @param number numElems
 */
static startVideosVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
};

/**
 * @param flatbuffers.Builder builder
 * @returns flatbuffers.Offset
 */
static endList(builder:flatbuffers.Builder):flatbuffers.Offset {
  var offset = builder.endObject();
  return offset;
};

static createList(builder:flatbuffers.Builder, videosOffset:flatbuffers.Offset):flatbuffers.Offset {
  List.startList(builder);
  List.addVideos(builder, videosOffset);
  return List.endList(builder);
}
}
}
/**
 * @constructor
 */
export namespace DenoTest{
export class Lolomo {
  bb: flatbuffers.ByteBuffer|null = null;

  bb_pos:number = 0;
/**
 * @param number i
 * @param flatbuffers.ByteBuffer bb
 * @returns Lolomo
 */
__init(i:number, bb:flatbuffers.ByteBuffer):Lolomo {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param flatbuffers.ByteBuffer bb
 * @param Lolomo= obj
 * @returns Lolomo
 */
static getRootAsLolomo(bb:flatbuffers.ByteBuffer, obj?:Lolomo):Lolomo {
  return (obj || new Lolomo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param flatbuffers.ByteBuffer bb
 * @param Lolomo= obj
 * @returns Lolomo
 */
static getSizePrefixedRootAsLolomo(bb:flatbuffers.ByteBuffer, obj?:Lolomo):Lolomo {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Lolomo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param number index
 * @param DenoTest.List= obj
 * @returns DenoTest.List
 */
lists(index: number, obj?:DenoTest.List):DenoTest.List|null {
  var offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new DenoTest.List()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
};

/**
 * @returns number
 */
listsLength():number {
  var offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @param flatbuffers.Builder builder
 */
static startLolomo(builder:flatbuffers.Builder) {
  builder.startObject(1);
};

/**
 * @param flatbuffers.Builder builder
 * @param flatbuffers.Offset listsOffset
 */
static addLists(builder:flatbuffers.Builder, listsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, listsOffset, 0);
};

/**
 * @param flatbuffers.Builder builder
 * @param Array.<flatbuffers.Offset> data
 * @returns flatbuffers.Offset
 */
static createListsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (var i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]);
  }
  return builder.endVector();
};

/**
 * @param flatbuffers.Builder builder
 * @param number numElems
 */
static startListsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
};

/**
 * @param flatbuffers.Builder builder
 * @returns flatbuffers.Offset
 */
static endLolomo(builder:flatbuffers.Builder):flatbuffers.Offset {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param flatbuffers.Builder builder
 * @param flatbuffers.Offset offset
 */
static finishLolomoBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
};

/**
 * @param flatbuffers.Builder builder
 * @param flatbuffers.Offset offset
 */
static finishSizePrefixedLolomoBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
};

static createLolomo(builder:flatbuffers.Builder, listsOffset:flatbuffers.Offset):flatbuffers.Offset {
  Lolomo.startLolomo(builder);
  Lolomo.addLists(builder, listsOffset);
  return Lolomo.endLolomo(builder);
}
}
}
