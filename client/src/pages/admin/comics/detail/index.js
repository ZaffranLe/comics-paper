import React from "react";
import { useParams } from "react-router-dom";

function ComicDetail() {
    const { id: comicId } = useParams();
    return <>
      Test
    </>;
}

export default ComicDetail;
