import React from "react";
import { Modal } from "../../../../components";
import * as comicApi from "../../../../utils/api/comics";
import { chapterViewTypeOptions } from "../../../../utils/constants";
import ListChapter from "./list-chapter";
import UpdateChapter from "./update-chapter";

function ChapterList({ open, onClose, updateComic, onDeleteChapter }) {
    const DEFAULT_CHAPTER_INFO = {
        id: null,
        name: "",
        viewType: chapterViewTypeOptions[0].value,
        viewTypeOption: chapterViewTypeOptions[0],
        comicId: "",
        length: 0,
        blocks: [],
        chapterNumber: "",
    };
    const [chapters, setChapters] = React.useState([]);
    const [isUpdatingChapter, setIsUpdatingChapter] = React.useState(false);
    const [chapterInfo, setChapterInfo] = React.useState(DEFAULT_CHAPTER_INFO);

    const fetchChapters = async () => {
        try {
            const resp = await comicApi.getAllComicChapters(updateComic.id);
            setChapters(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        if (updateComic && open) {
            fetchChapters();
        }
    }, [open]);

    return (
        <>
            {updateComic && (
                <Modal dimmer open={open} onClose={onClose}>
                    <div className="w-1/2 bg-white border rounded-xl p-4">
                        {isUpdatingChapter ? (
                            <UpdateChapter
                                setIsUpdatingChapter={setIsUpdatingChapter}
                                chapterInfo={chapterInfo}
                                setChapterInfo={setChapterInfo}
                                fetchChapters={fetchChapters}
                                updateComic={updateComic}
                            />
                        ) : (
                            <ListChapter
                                fetchChapters={fetchChapters}
                                onDeleteChapter={onDeleteChapter}
                                setChapterInfo={setChapterInfo}
                                setIsUpdatingChapter={setIsUpdatingChapter}
                                chapters={chapters}
                            />
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ChapterList;
