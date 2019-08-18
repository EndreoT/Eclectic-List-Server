export declare const db: {
    Post: import("mongoose").Model<import("./post").IPost, {}>;
    Comment: import("mongoose").Model<import("./comment").IComment, {}>;
    User: import("mongoose").Model<import("./user").IUser, {}>;
    Image: import("mongoose").Model<import("./image").IImage, {}>;
    Category: import("mongoose").Model<import("./category").ICategory, {}>;
};
