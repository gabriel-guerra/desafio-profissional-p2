import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";

@Schema()
export class Character{

    @Prop()
    name: string;

    @Prop()
    level: number;

    @Prop()
    class: string;

    @Prop(raw({
        str: { type: Number },
        dex: { type: Number },
        con: { type: Number },
        int: { type: Number },
        wis: { type: Number },
        cha: { type: Number }
    }))
    attributes: Record<string, any>;

    @Prop()
    feats: string;

    @Prop()
    alignment: string;

    @Prop()
    magic: string[];

    @Prop()
    items: string[];
}

export const CharacterShema = SchemaFactory.createForClass(Character);