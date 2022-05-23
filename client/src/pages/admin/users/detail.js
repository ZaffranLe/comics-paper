import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as userApi from "../../../utils/api/users";
import * as comicApi from "../../../utils/api/comics";

function AdminUserDetail() {
    const [userInfo, setUserInfo] = React.useState({});
    const params = useParams();

    React.useEffect(() => {
        const userId = params.id;
        fetchUserDetail(userId);
    }, [params]);

    const fetchUserDetail = async (id) => {
        try {
            const resp = await userApi.getUserDetail(id);
            setUserInfo(resp.data);
        } catch (e) {
            console.error(e);
            toast.error("Lấy thông tin người dùng thất bại");
        }
    };

    return <></>;
}

export default AdminUserDetail;
