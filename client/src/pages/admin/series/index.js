import React from "react";
import * as comicApi from "../../../utils/api/comics";
import { BookThumbnail, ConfirmModal } from "../../../components";
import { toast } from "react-toastify";
import { v1 as uuidv1 } from "uuid";
import UpdateSerie from "./update";

function Series() {
    const [series, setSeries] = React.useState([]);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [updateSerie, setUpdateSerie] = React.useState(null);
    const [randomKey, setRandomKey] = React.useState(0);
    const [confirmModal, setConfirmModal] = React.useState({
        content: "",
        onClose: () => {},
        onConfirm: () => {},
        open: false,
        loading: false,
    });

    const fetchSeries = async () => {
        try {
            const resp = await comicApi.getAllComic();
            setSeries(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchSeries();
    }, []);

    const handleOpenUpdateModal = (selectedBookTag = null) => {
        setRandomKey(uuidv1());
        setUpdateModal(true);
        if (selectedBookTag) {
            setUpdateSerie(selectedBookTag);
        }
    };

    const handleCloseUpdateModal = () => {
        setUpdateModal(false);
        if (updateSerie) {
            setUpdateSerie(null);
        }
    };

    const handleSave = async (keyword) => {
        // try catch is in UpdateSerie
        if (updateSerie) {
            // await bookTagApi.updateSerie(updateSerie.id, keyword);
            toast.success("Cập nhật truyện thành công");
        } else {
            // await bookTagApi.createBookTag(keyword);
            toast.success("Tạo truyện thành công");
        }
        await fetchSeries();
    };

    const handleDeleteSerie = (serie) => {
        setConfirmModal({
            content: `Bạn có chắc chắn muốn xóa truyện '${serie.name}' không?`,
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

    return (
        <>
            <div className="text-2xl font-bold">Danh sách truyện</div>
            <button
                onClick={() => handleOpenUpdateModal()}
                className="bg-transparent hover:underline hover:text-indigo-500 font-semibold px-2 py-1 mt-4"
            >
                Tạo mới
            </button>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {series.map((_serie) => (
                    <div key={_serie.id}>
                        <BookThumbnail info={_serie} />
                    </div>
                ))}
            </div>
            <UpdateSerie
                key={randomKey}
                open={updateModal}
                onClose={handleCloseUpdateModal}
                onSave={handleSave}
                updateSerie={updateSerie}
            />
            <ConfirmModal {...confirmModal} />
        </>
    );
}

export default Series;
