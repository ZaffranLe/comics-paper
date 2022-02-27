import React from "react";
import * as comicApi from "../../../utils/api/comics";
import * as bookTagApi from "../../../utils/api/book-tags";
import { ComicThumbnail, ConfirmModal } from "../../../components";
import { toast } from "react-toastify";
import { v1 as uuidv1 } from "uuid";
import UpdateComic from "./update";
import ContextMenu from "./context-menu";

function Comics() {
    const [comics, setComics] = React.useState([]);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [updateComic, setUpdateComic] = React.useState(null);
    const [randomKey, setRandomKey] = React.useState(0);
    const [confirmModal, setConfirmModal] = React.useState({
        content: "",
        onClose: () => {},
        onConfirm: () => {},
        open: false,
        loading: false,
    });
    const [bookTagOptions, setBookTagOptions] = React.useState([]);
    const [contextMenuModal, setContextMenuModal] = React.useState(false);

    const fetchComics = async () => {
        try {
            const resp = await comicApi.getAllComic();
            setComics(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchBookTags = async () => {
        try {
            const resp = await bookTagApi.getAllBookTag();
            setBookTagOptions(resp.data.map((_tag) => ({ label: _tag.keyword, value: _tag.id })));
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchComics();
        fetchBookTags();
    }, []);

    const handleOpenUpdateModal = (selectedComic = null) => {
        setRandomKey(uuidv1());
        setUpdateModal(true);
        if (contextMenuModal) {
            setContextMenuModal(false);
        }
        if (selectedComic) {
            setUpdateComic(selectedComic);
        }
    };

    const handleCloseUpdateModal = () => {
        setUpdateModal(false);
        if (updateComic) {
            setUpdateComic(null);
        }
    };

    const handleSave = async (comic) => {
        // try catch is in UpdateComic
        if (updateComic) {
            await comicApi.updateComic(updateComic.id, comic);
            toast.success("Cập nhật truyện thành công");
        } else {
            await comicApi.createComic(comic);
            toast.success("Tạo truyện thành công");
        }
        await fetchComics();
    };

    const handleDeleteComic = (comic) => {
        setConfirmModal({
            content: `Bạn có chắc chắn muốn xóa truyện '${comic.name}' không?`,
            open: true,
            loading: false,
            onClose: () => {
                setConfirmModal({ ...confirmModal, open: false });
            },
            onConfirm: async () => {
                setConfirmModal({ ...confirmModal, loading: true });
                try {
                    // await bookTagApi.deleteBookTag(tag.id);
                    toast.success("Xóa truyện thành công");
                    // await fetchBookTags();
                } catch (e) {
                    console.error(e);
                    toast.error("Xóa truyện thất bại, vui lòng thử lại sau.");
                } finally {
                    setConfirmModal({
                        ...confirmModal,
                        loading: false,
                        open: false,
                    });
                }
            },
        });
    };

    const handleOpenContextMenu = (e, _comic) => {
        e.preventDefault();
        setUpdateComic(_comic);
        setContextMenuModal(true);
    };

    const handleCloseContextMenu = () => {
        setUpdateComic(null);
        setContextMenuModal(false);
    };

    return (
        <>
            <div className="text-2xl font-bold">Danh sách truyện</div>
            <button
                onClick={() => handleOpenUpdateModal()}
                className="bg-transparent hover:underline hover:text-indigo-500 font-semibold px-2 py-1 mt-4"
            >
                Tạo mới
            </button>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
                {comics.map((_comic) => (
                    <div key={_comic.id} onClick={(e) => handleOpenContextMenu(e, _comic)}>
                        <ComicThumbnail
                            comic={_comic}
                            url={`#`}
                        />
                    </div>
                ))}
            </div>
            <UpdateComic
                key={randomKey}
                open={updateModal}
                onClose={handleCloseUpdateModal}
                onSave={handleSave}
                updateComic={updateComic}
                tagOptions={bookTagOptions}
            />
            <ConfirmModal {...confirmModal} />
            <ContextMenu
                open={contextMenuModal}
                onClose={handleCloseContextMenu}
                updateComic={updateComic}
                onClickUpdate={handleOpenUpdateModal}
            />
        </>
    );
}

export default Comics;
