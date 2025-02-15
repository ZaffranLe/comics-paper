import { useEffect, useState } from "react";
import { getAllViews } from "../../../utils/api/comics";

function Dashboard() {
    const [totalViews, setTotalViews] = useState(10e2);

    useEffect(() => {
        getAllViews().then((e) => {
            setTotalViews(e.data.totalView);
        });
    }, []);

    return (
        <>
            <div className="flex flex-row gap-4 bg-neutral-50 ">
                {/* General viewws */}
                <div className="flex flex-row px-4 py-4 rounded-md bg-neutral-50 ">
                    <div className="flex flex-col gap-4 px-6 items-center">
                        <b className="text-2xl text-neutral-400">
                            Tổng số lượt xem
                        </b>
                        <b className="text-6xl">{totalViews}</b>
                    </div>
                </div>

                {/*  */}

                <div className="flex flex-row bg-neutral-100 px-4 py-4 rounded-md">
                    <div className="flex flex-col gap-4 px-6 items-center">
                        <b className="text-2xl text-neutral-400">
                            Tổng số lượt đánh giá
                        </b>
                        <b className="text-6xl">
                            {Number.parseInt(
                                Math.floor(totalViews * (10 / 100) * 0.9)
                            )}
                        </b>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
