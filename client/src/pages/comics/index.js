import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ComicThumbnail } from "../../components";
import Select from "react-select";
import { classNames } from "../../utils/common";
import { categoryOptions } from "../../utils/constants";
import * as comicApi from "../../utils/api/comics";
import * as bookTagApi from "../../utils/api/book-tags";

function Comics() {
    const [comics, setComics] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchInfo, setSearchInfo] = useState({
        category: null,
        tags: [],
        notTags: [],
        tagsValue: [],
        notTagsValue: [],
        limit: 16,
        offset: 0,
    });
    const [hasNext, setHasNext] = useState(true);
    const [filterSectionOpen, setFilterSectionOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const observer = useRef();
    const lastComicRef = useCallback(
        (node) => {
            if (observer.current) {
                observer.current.disconnect();
            }
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNext) {
                    handleFetchMoreComic();
                }
            });
            if (node) {
                observer.current.observe(node);
            }
        },
        [comics, hasNext]
    );

    const fetchComics = async (query = {}, append = false, _hasNext = true) => {
        setLoading(true);
        try {
            if (_hasNext) {
                const searchQuery = { ...query };
                delete searchQuery.tagsValue;
                delete searchQuery.notTagsValue;
                const resp = await comicApi.getAllComic(searchQuery);
                if (append) {
                    setComics([...comics, ...resp.data]);
                } else {
                    setComics(resp.data);
                }
                if (resp.data.length === 0) {
                    setHasNext(false);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookTags = async () => {
        try {
            const resp = await bookTagApi.getAllBookTag();
            const _tags = resp.data.map((_tag) => ({ label: _tag.keyword, value: _tag.id }));
            setTags(_tags);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        document.title = "Danh sách truyện - Virtuoso Translation";
        fetchComics(searchInfo, false, true);
        fetchBookTags();
    }, []);

    const handleSelectCategory = (selectedCategory) => {
        setSearchInfo({
            ...searchInfo,
            category: searchInfo.category === selectedCategory ? null : selectedCategory,
        });
    };

    const handleFilterTags = (name) => (selectedTags) => {
        setSearchInfo({
            ...searchInfo,
            [name]: selectedTags.map((_tag) => _tag.value),
            [`${name}Value`]: selectedTags,
        });
    };

    const handleSearch = () => {
        const query = {
            ...searchInfo,
            offset: 0,
        };
        setSearchInfo(query);
        fetchComics(query, false, true);
        setHasNext(true);
    };

    const handleFetchMoreComic = () => {
        const query = {
            ...searchInfo,
            offset: searchInfo.offset + searchInfo.limit,
        };
        setSearchInfo(query);
        fetchComics(query, true, hasNext);
    };

    const includedTagOptions = tags.filter((_tag) => !searchInfo.notTags.includes(_tag.value));
    const notIncludedTagOptions = tags.filter((_tag) => !searchInfo.tags.includes(_tag.value));

    return (
        <>
            <div className="grid grid-rows-1 md:grid-cols-3 gap-8 pb-4">
                <div
                    className={classNames(
                        filterSectionOpen && "ring-2 ring-gray-800",
                        "block md:hidden bg-gray-800 rounded-xl cursor-pointer"
                    )}
                >
                    <div
                        className="text-white rounded p-3 font-bold text-lg"
                        onClick={() => setFilterSectionOpen(!filterSectionOpen)}
                    >
                        <div className="flex">
                            <div className="grow">
                                <FontAwesomeIcon icon="sliders-h" /> Bộ lọc
                            </div>
                            <div>
                                <FontAwesomeIcon
                                    icon={filterSectionOpen ? "chevron-down" : "chevron-right"}
                                />
                            </div>
                        </div>
                    </div>
                    {filterSectionOpen && (
                        <div className="grid grid-rows-1 divide-y bg-white rounded-b-xl p-3">
                            <div className="p-4">
                                <div className="font-bold text-xl mb-4">Danh mục</div>
                                <div className="grid grid-flow-col auto-cols-auto">
                                    {categoryOptions.map((_option) => (
                                        <div key={_option.value}>
                                            <span
                                                className={classNames(
                                                    searchInfo.category === _option.value
                                                        ? "font-bold bg-gray-200"
                                                        : "font-medium",
                                                    "cursor-pointer select-none hover:underline hover:bg-gray-100 rounded px-2 py-1"
                                                )}
                                                onClick={() => handleSelectCategory(_option.value)}
                                            >
                                                {_option.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 grid grid-rows-1 gap-4">
                                <div className="font-bold text-xl">Thể loại</div>
                                <div>
                                    <div className="font-semibold text-lg">Tìm trong</div>
                                    <Select
                                        options={includedTagOptions}
                                        className="hover:ring-1 hover:ring-gray-400 rounded"
                                        styles={{ cursor: "pointer" }}
                                        isMulti
                                        onChange={handleFilterTags("tags")}
                                        value={searchInfo.tagsValue}
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">Không tìm trong</div>
                                    <Select
                                        options={notIncludedTagOptions}
                                        className="hover:ring-1 hover:ring-gray-400 rounded"
                                        styles={{ cursor: "pointer" }}
                                        isMulti
                                        onChange={handleFilterTags("notTags")}
                                        value={searchInfo.notTagsValue}
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-gray-800 hover:bg-gray-600 text-white w-full rounded-lg m-2 p-2"
                                >
                                    <FontAwesomeIcon icon="search" /> Tìm kiếm
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                        {comics.map((_comic, _idx) =>
                            comics.length === _idx + 1 ? (
                                <div key={_comic.id} ref={lastComicRef}>
                                    <ComicThumbnail
                                        comic={_comic}
                                        url={`/comics/${_comic.slug}&${_comic.id}`}
                                    />
                                </div>
                            ) : (
                                <div key={_comic.id}>
                                    <ComicThumbnail
                                        comic={_comic}
                                        url={`/comics/${_comic.slug}&${_comic.id}`}
                                    />
                                </div>
                            )
                        )}
                        {loading && (
                            <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-center text-4xl">
                                <FontAwesomeIcon icon="spinner" spin />
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden md:block col-span-1">
                    <div className="bg-gray-800 text-white rounded p-2 font-bold text-xl">
                        <FontAwesomeIcon icon="sliders-h" /> Bộ lọc
                    </div>
                    <div className="grid grid-rows-1 divide-y">
                        <div className="p-4">
                            <div className="font-bold text-xl mb-4">Danh mục</div>
                            <div className="grid grid-flow-col auto-cols-auto">
                                {categoryOptions.map((_option) => (
                                    <div key={_option.value}>
                                        <span
                                            className={classNames(
                                                searchInfo.category === _option.value
                                                    ? "font-bold bg-gray-200"
                                                    : "font-medium",
                                                "cursor-pointer select-none hover:underline hover:bg-gray-100 rounded px-2 py-1"
                                            )}
                                            onClick={() => handleSelectCategory(_option.value)}
                                        >
                                            {_option.label}{" "}
                                            {searchInfo.category === _option.value && (
                                                <FontAwesomeIcon icon="times" />
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 grid grid-rows-1 gap-4">
                            <div className="font-bold text-xl">Thể loại</div>
                            <div>
                                <div className="font-semibold text-lg">Tìm trong</div>
                                <Select
                                    options={includedTagOptions}
                                    className="hover:ring-1 hover:ring-gray-400 rounded"
                                    styles={{ cursor: "pointer" }}
                                    isMulti
                                    onChange={handleFilterTags("tags")}
                                    value={searchInfo.tagsValue}
                                />
                            </div>
                            <div>
                                <div className="font-semibold text-lg">Không tìm trong</div>
                                <Select
                                    options={notIncludedTagOptions}
                                    className="hover:ring-1 hover:ring-gray-400 rounded"
                                    styles={{ cursor: "pointer" }}
                                    isMulti
                                    onChange={handleFilterTags("notTags")}
                                    value={searchInfo.notTagsValue}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleSearch}
                                className="bg-gray-800 hover:bg-gray-600 text-white w-full rounded-lg m-2 p-2"
                            >
                                <FontAwesomeIcon icon="search" /> Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Comics;
