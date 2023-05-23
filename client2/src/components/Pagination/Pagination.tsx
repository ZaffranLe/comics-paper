import { MouseEventHandler, useState } from "react";
import {
  AiOutlineLeft,
  AiOutlineDoubleLeft,
  AiOutlineRight,
  AiOutlineDoubleRight,
} from "react-icons/ai";

export interface PaginationProps {
  currentPage: number;
  maxPage: number;

  onNext?: () => void;
  onLast?: () => void;
  onPrevious?: () => void;
  onFirst?: (event: object) => void;
}

export function Pagination(props: PaginationProps) {
  if (props.currentPage > props.maxPage) {
    throw new Error(`Current page cannot be larger than max page`);
  }

  const handleMoveFirst = (event: MouseEventHandler<HTMLButtonElement>) => {
    props.onFirst && props.onFirst(event);
  };

  return (
    <div className="flex flex-row items-center gap-3 text-sm text-neutral-500">
      <button title="Move most left" onClick={handleMoveFirst}>
        <AiOutlineDoubleLeft />
      </button>
      <button title="Move left">
        <AiOutlineLeft />
      </button>

      {/* <button title="Move most left">1</button>
      <button title="Move most left">2</button>
      <button title="Move most left">3</button>
      <button title="">...</button> */}

      {[...Array(props.maxPage)].fill(true).map((_a, _idx) => {
        if (_idx === props.currentPage) {
          return <button className="font-bold">{_idx + 1}</button>;
        }
        return <button>{_idx + 1}</button>;
      })}

      <button title="Move left">
        <AiOutlineRight />
      </button>
      <button title="Move most left">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
}
