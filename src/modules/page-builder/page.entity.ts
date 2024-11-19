import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity } from "typeorm";
import { PageType } from "./page.enum";
import { ObjectType } from "@/common/types/collection.type";
import { MetaKeywordTransformer } from "@/common/transformer/meta-keyword.transformer";

@Entity()
export class User extends BaseModel {

    @Column()
    name: string;

    @Column()
    alias: string;

    @Column("enum")
    pageType: PageType;

    @Column({ default: null })
    customJs: string | null;

    @Column({ default: null })
    customCss: string | null;

    @Column({type: 'text', transformer: new MetaKeywordTransformer()})
    meta: ObjectType<string>;
}