interface IPostModelConstants {
    subjectMin: number;
    subjectMax: number;
    descriptionMin: number;
    descriptionMax: number;
}

const constants: IPostModelConstants = {
    subjectMin: 1,
    subjectMax: 255,
    descriptionMin: 1,
    descriptionMax: 10000,
};

export const postModelConstants = constants;
