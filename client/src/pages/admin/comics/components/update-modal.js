import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../../components";
import { classNames } from "../../../../utils/common";
import * as resourceApi from "../../../../utils/api/resources";
import Select from "react-select";
import { categoryOptions } from "../../../../utils/constants";

function UpdateComic({ open, onClose, onSave, updateComic, tagOptions }) {
    const [comic, setComic] = React.useState({
        thumbnail: null,
        name: "",
        description: "",
        author: "",
        tags: [],
        tagOptions: [],
        category: "",
        categoryOption: null,
    });
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (updateComic) {
            const _categoryOption = categoryOptions.find(
                (_category) => _category.value === updateComic.category
            );
            const _tags = updateComic.tags?.split(",") || [];
            const _tagOptions = tagOptions.filter((_tag) => _tags.includes(_tag.value.toString()));
            setComic({
                ...comic,
                ...updateComic,
                categoryOption: _categoryOption,
                tags: _tags,
                tagOptions: _tagOptions,
            });
        }
    }, [updateComic]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await onSave(comic);
            onClose();
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Cập nhật truyện thất bại, vui lòng thử lại sau."
            );
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeComicInfo = (name) => (e) => {
        const value = e.target.value;
        setComic({ ...comic, [name]: value });
    };

    const handleChangeThumbnail = async (e) => {
        try {
            if (e.target.files.length > 0) {
                const resp = await resourceApi.uploadImages(e.target.files);
                const imgInfo = resp.data[0];
                setComic({
                    ...comic,
                    thumbnailImg: imgInfo.fileName,
                    thumbnail: imgInfo.id,
                });
            }
        } catch (e) {
            if (e.response.data) {
                toast.error(
                    e.response?.data?.error?.message || "Upload ảnh thất bại, vui lòng thử lại sau."
                );
            }
        }
    };

    const handleChangeCategory = (selectedOption) => {
        setComic({ ...comic, category: selectedOption.value, categoryOption: selectedOption });
    };

    const handleChangeTags = (selectedOptions) => {
        setComic({
            ...comic,
            tags: selectedOptions.map((_option) => _option.value),
            tagOptions: selectedOptions,
        });
    };

    return (
        <>
            <Modal dimmer open={open} onClose={onClose}>
                <div className="w-1/3 bg-white border rounded-xl p-4">
                    <div className="text-xl font-bold">
                        {updateComic ? "Cập nhật truyện" : "Tạo truyện mới"}
                    </div>
                    <div className="grid grid-cols-3 my-4 gap-8">
                        <label
                            htmlFor="comic-thumbnail-upload"
                            className={classNames(
                                comic.thumbnail ? "border-gray-800" : "border-green-700",
                                "border rounded-lg flex items-center cursor-pointer select-none",
                                "h-[200px] overflow-hidden"
                            )}
                        >
                            {comic.thumbnail ? (
                                <img
                                    src={`${process.env.REACT_APP_ORIGIN_BACKEND}/public/${comic.thumbnailImg}`}
                                    className="w-full"
                                    alt="thumbnail"
                                />
                            ) : (
                                <div className="text-center w-full text-green-700">
                                    <FontAwesomeIcon icon="plus" />
                                    <div>Thumbnail</div>
                                </div>
                            )}
                        </label>
                        <input
                            id="comic-thumbnail-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleChangeThumbnail}
                        />
                        <div className="col-span-2">
                            <div>
                                <label>Tên truyện</label>
                                <input
                                    className="input w-full"
                                    onChange={handleChangeComicInfo("name")}
                                    value={comic.name}
                                />
                            </div>
                            <div>
                                <label>Danh mục</label>
                                <Select
                                    className="w-full"
                                    value={comic.categoryOption}
                                    options={categoryOptions}
                                    onChange={handleChangeCategory}
                                />
                            </div>
                            <div>
                                <label>Tác giả</label>
                                <input
                                    className="input w-full"
                                    onChange={handleChangeComicInfo("author")}
                                    value={comic.author}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label>Thể loại</label>
                            <Select
                                className="w-full"
                                value={comic.tagOptions}
                                isMulti
                                options={tagOptions}
                                onChange={handleChangeTags}
                            />
                        </div>
                        <div>
                            <label>Tóm tắt</label>
                            <textarea
                                className="input w-full"
                                rows={4}
                                onChange={handleChangeComicInfo("description")}
                                value={comic.description}
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <button
                            onClick={handleSave}
                            className={classNames(
                                !loading && "hover:bg-indigo-400 hover:text-white",
                                "ring-2 ring-indigo-400 text-indigo-400 font-semibold py-2 px-4 rounded-full mr-2"
                            )}
                            disabled={loading}
                        >
                            {loading ? <FontAwesomeIcon icon="spinner" spin fixedWidth /> : "Lưu"}
                        </button>
                        <button
                            onClick={onClose}
                            className="ring-2 ring-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white font-semibold py-2 px-4 rounded-full ml-2"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default UpdateComic;
