export class User {
  constructor (name, email, image) {
    this.name = name
    this.email = email
    this.image = image
  }
}

export const UserSchema = {
  name: 'User',
  target: User,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar',
      //comments: "Name",
      nullable: true
    },
    email: {
      type: 'varchar',
      //comments: "Email of the User",
      unique: true
    },
    image: {
      type: 'varchar',
      //comments: "Image URL",
      nullable: true
    },
    dateCreated: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    },
    dateUpdated: {
      type: 'timestamp',
      nullable: true
    }

  }
}
