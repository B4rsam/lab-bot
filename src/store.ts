import db from "src/database";
import type { UserInput } from "src/props";

const dbRegister = db.prepare('INSERT INTO register_log (user_id, username) VALUES (?, ?) RETURNING *');
const dbUser = db.prepare('INSERT INTO users (user_id, username) VALUES (?, ?) RETURNING *');

const dbRegisterDelete = db.prepare('DELETE FROM register_log WHERE user_id = ?');
const dbUserDelete = db.prepare('DELETE FROM users WHERE user_id = ?');

class DataStore {
    userStore: Map<Number, UserInput>;
    registerStore: Map<Number, UserInput>;
    ownerChatID: number;

    constructor() {
        this.userStore = new Map();
        this.registerStore = new Map();
        this.ownerChatID = NaN;
    }

    init() {
        const registers = db.prepare(`SELECT * FROM register_log`);
        const users = db.prepare(`SELECT * FROM users`);

        // @ts-ignore
        users.all().forEach((item) => this.userStore.set(item.user_id, item));
        // @ts-ignore
        registers.all().forEach((item) => this.registerStore.set(item.user_id, item));
    }

    getRegister(id: number) {
        return this.registerStore.get(id);
    }

    getUser(id: number)  {
        return this.userStore.get(id);
    }

    addRegister(data: UserInput) {
        const { id, username } = data;

        const dbData = dbRegister.all(id, username);
        this.registerStore.set(id, dbData[0] as UserInput);
    }

    deleteRegister(id: number) {
        dbRegisterDelete.run(id);
        this.registerStore.delete(id);
    }

    addUser(data: UserInput) {
        const { id, username } = data;

        const dbData = dbUser.all(id, username) as UserInput[];
        this.userStore.set(id, dbData[0] as UserInput);

        this.deleteRegister(id);
    }

    deleteUser(id: number) {
        dbUserDelete.run(id);
        this.userStore.delete(id);
    }

    setOwnerChat(id: number) {
        this.ownerChatID = id;
    }

    getOwnerChat() {
        return this.ownerChatID;
    }

    isOwner(id: number) {
        return Number(id) === Number(process.env.OWNER_ID);
    }

    getAllRegisters() {
        return this.registerStore.entries();
    }

    getAllUsers() {
        return this.userStore.entries();
    }
}

const dataStore = new DataStore();

export default dataStore;
