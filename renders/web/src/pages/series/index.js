import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookThumbnail } from "../../components";
import { mangaList, tags } from "../../utils/mock-data";
import Select from "react-select";
import { classNames } from "../../utils/common";

function Series() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [serializedSearchParams, setSerializedSearchParams] = useState({});

    useEffect(() => {
        console.log(Object.fromEntries([...searchParams]));
        setSerializedSearchParams(Object.fromEntries([...searchParams]));
    }, [searchParams]);

    const handleSelectType = (selectedType) => {
        setSearchParams({
            ...serializedSearchParams,
            type: selectedType,
            tags: ["abc", "123"],
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
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                        {mangaList.map((_manga) => (
                            <BookThumbnail info={_manga} key={_manga.id} />
                        ))}
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-gray-800 text-white rounded p-2 font-bold text-xl">
                        <FontAwesomeIcon icon="sliders-h" /> Lọc truyện
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
                        <div className="p-4">
                            <div className="font-bold text-xl mb-4">
                                Thể loại
                            </div>
                            <Select
                                options={tags}
                                className="hover:ring-1 hover:ring-gray-400 rounded"
                                styles={{ cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Series;
