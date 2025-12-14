import db from "src/database";
import type { UserInput } from "src/props";

const dbRegister = db.prepare('INSERT INTO register_log (user_id, username) VALUES (?, ?) RETURNING *');
const dbUser = db.prepare('INSERT INTO users (user_id, username) VALUES (?, ?) RETURNING *');

const dbRegisterDelete = db.prepare('DELETE FROM register_log WHERE user_id = ?');
const dbUserDelete = db.prepare('DELETE FROM users WHERE user_id = ?');

class DataStore {
    userStore = new Map();
    registerStore = new Map();
    ownerChatID = NaN;

    constructor() {
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
        this.registerStore.set(id, dbData[0]);
    }

    deleteRegister(id: number) {
        dbRegisterDelete.run(id);
        this.registerStore.delete(id);
    }

    addUser(data: UserInput) {
        const { id, username } = data;

        const dbData = dbUser.all(id, username);
        this.userStore.set(id, dbData[0]);

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
}

const dataStore = new DataStore();

export default dataStore;
