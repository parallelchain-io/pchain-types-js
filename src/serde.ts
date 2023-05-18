import * as borsh from 'borsh';

/**
    * borshSerialize serializes an object into a byte stream
*/
export const borshSerialize = (value:object, schema:borsh.Schema, writer: typeof borsh.BinaryWriter | undefined = undefined) => {
    const buffer = Buffer.from(borsh.serialize(schema, value, writer));
    return buffer;
}

/**
    * borshDeserialize deserializes a byte stream into object of a specified class
*/
export const borshDeserialize = (buffer:Buffer, schema:borsh.Schema, struct:any, reader: typeof borsh.BinaryReader | undefined = undefined) => {
    const readBuffer = borsh.deserializeUnchecked(schema, struct, buffer, reader);
    return readBuffer
}