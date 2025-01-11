import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'ecommerce', name: 'products' })
export class Product {
  @ApiProperty({
    example: 'cd532245-f1f3-48c9-a62e-7dc1da50c8f8',
    description: 'Id del producto',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt RealG',
    description: 'Titulo del producto',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 100,
    description: 'Precio del producto',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Camisa con estampado del logo RealG',
    description: 'Descripcion del producto',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 't-shirt-realg',
    description: 'Producto',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Cantidad del producto',
    default: 0,
  })
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Listado de tamaños del producto',
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'mujer',
    description: 'Genero del producto',
  })
  @Column({
    type: 'text',
  })
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
