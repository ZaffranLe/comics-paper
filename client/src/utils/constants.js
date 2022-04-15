const categoryOptions = [
    {
        label: "Truyện tranh",
        value: "Comic",
    },
    {
        label: "Truyện chữ",
        value: "Novel",
    },
];

const chapterViewTypeOptions = [
    {
        value: "image",
        label: "Ảnh",
    },
    {
        value: "text",
        label: "Văn bản",
    },
];

const chapterViewTypes = {
    IMAGE: {
        TEXT: "image",
        VALUE: 1,
        LABEL: "Ảnh",
    },
    TEXT: {
        TEXT: "text",
        VALUE: 2,
        LABEL: "Văn bản",
    },
};

const CATEGORIES = {
    COMIC: "Comic",
    NOVEL: "Novel",
};

const ROLE = {
    ADMIN: 1,
};

export { categoryOptions, chapterViewTypeOptions, chapterViewTypes, CATEGORIES, ROLE };
