import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookThumbnail } from "../../components";
import { mangaList, tags } from "../../utils/mock-data";
import Select from "react-select";
import { classNames } from "../../utils/common";

function Comics() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [serializedSearchParams, setSerializedSearchParams] = useState({
        type: null,
        tags: [],
        notTags: [],
    });
    const [filterSectionOpen, setFilterSectionOpen] = useState(false);
    useEffect(() => {
        setSerializedSearchParams(Object.fromEntries([...searchParams]));
    }, [searchParams]);

    const handleSelectType = (selectedType) => {
        setSearchParams({
            ...serializedSearchParams,
            type: selectedType,
        });
    };

    const handleFilterTags = (name) => (selectedTags) => {
        setSearchParams({
            ...serializedSearchParams,
            [name]: selectedTags.map((_tag) => _tag.value).join(","),
        });
    };

    const typeOptions = [
        {
            key: "comic",
            label: "Truyện tranh",
        },
        {
            key: "novel",
            label: "Novel",
        },
    ];

    return (
        <>
            <div className="grid grid-rows-1 md:grid-cols-3 gap-8">
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
                                    icon={
                                        filterSectionOpen
                                            ? "chevron-down"
                                            : "chevron-right"
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {filterSectionOpen && (
                        <div className="grid grid-rows-1 divide-y bg-white rounded-b-xl p-3">
                            <div className="p-4">
                                <div className="font-bold text-xl mb-4">
                                    Danh mục
                                </div>
                                <div className="grid grid-flow-col auto-cols-auto">
                                    {typeOptions.map((_option) => (
                                        <div key={_option.key}>
                                            <span
                                                className={classNames(
                                                    serializedSearchParams.type ===
                                                        _option.key
                                                        ? "font-bold bg-gray-200"
                                                        : "font-medium",
                                                    "cursor-pointer hover:underline hover:bg-gray-100 rounded px-2 py-1"
                                                )}
                                                onClick={() =>
                                                    handleSelectType(
                                                        _option.key
                                                    )
                                                }
                                            >
                                                {_option.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 grid grid-rows-1 gap-4">
                                <div className="font-bold text-xl">
                                    Thể loại
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">
                                        Tìm trong
                                    </div>
                                    <Select
                                        options={tags}
                                        className="hover:ring-1 hover:ring-gray-400 rounded"
                                        styles={{ cursor: "pointer" }}
                                        isMulti
                                        onChange={handleFilterTags("tags")}
                                        // value={serializedSearchParams.tags}
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">
                                        Không tìm trong
                                    </div>
                                    <Select
                                        options={tags}
                                        className="hover:ring-1 hover:ring-gray-400 rounded"
                                        styles={{ cursor: "pointer" }}
                                        isMulti
                                        onChange={handleFilterTags("notTags")}
                                        // value={serializedSearchParams.notTags}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                        {mangaList.map((_manga) => (
                            <BookThumbnail info={_manga} key={_manga.id} />
                        ))}
                    </div>
                </div>
                <div className="hidden md:block col-span-1">
                    <div className="bg-gray-800 text-white rounded p-2 font-bold text-xl">
                        <FontAwesomeIcon icon="sliders-h" /> Bộ lọc
                    </div>
                    <div className="grid grid-rows-1 divide-y">
                        <div className="p-4">
                            <div className="font-bold text-xl mb-4">
                                Danh mục
                            </div>
                            <div className="grid grid-flow-col auto-cols-auto">
                                {typeOptions.map((_option) => (
                                    <div key={_option.key}>
                                        <span
                                            className={classNames(
                                                serializedSearchParams.type ===
                                                    _option.key
                                                    ? "font-bold bg-gray-200"
                                                    : "font-medium",
                                                "cursor-pointer hover:underline hover:bg-gray-100 rounded px-2 py-1"
                                            )}
                                            onClick={() =>
                                                handleSelectType(_option.key)
                                            }
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
                                <div className="font-semibold text-lg">
                                    Tìm trong
                                </div>
                                <Select
                                    options={tags}
                                    className="hover:ring-1 hover:ring-gray-400 rounded"
                                    styles={{ cursor: "pointer" }}
                                    isMulti
                                    onChange={handleFilterTags("tags")}
                                    // value={serializedSearchParams.tags}
                                />
                            </div>
                            <div>
                                <div className="font-semibold text-lg">
                                    Không tìm trong
                                </div>
                                <Select
                                    options={tags}
                                    className="hover:ring-1 hover:ring-gray-400 rounded"
                                    styles={{ cursor: "pointer" }}
                                    isMulti
                                    onChange={handleFilterTags("notTags")}
                                    // value={serializedSearchParams.notTags}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Comics;
