import React, { useEffect, useReducer, useState } from "react";

import tableStyle from "style/layout/dataTable/table.module.css";
import listStyle from "style/layout/dataTable/listTableData.module.css";
import HelperModal from "component/common/helper/HelperModal";

const HELPER_KEY = 113;

//headers: 테이블 header, items: 테이블 내용, onTrigger:부모 요소로 이벤트 발송할 수 있는 handler, onCheckboxChange: 선택 컬럼 체크시 handler
export default function ListTable({
  headers,
  items,
  onTrigger,
  onCheckboxChange,
  emitItem,
}) {
  const modalInit = {
    showModal: false,
    codeValue: "", //
    codeName: "",
  };

  const [tableItems, setTableItems] = useState();

  useEffect(() => {
    if (items) {
      if (emitItem) emitItem(items);
      setTableItems([...items]);
    }
  }, [items, emitItem]);

  //모달 끄고 닫는 핸들러
  const onModalHanlder = (codeValue, codeName) => {
    // console.log('onmodalHandler',value)
    dispatch({ type: "ON_MODAL", codeValue, codeName });
  };
  const offModalHandler = () => {
    dispatch({ type: "OFF_MODAL" });
  };
  //모달 reducer (on/off, 코드 타입)
  const modalReducer = (state, action) => {
    if (action.type === "ON_MODAL") {
      return {
        showModal: true,
        codeValue: action.codeValue,
        codeName: action.codeName,
      };
    }
    if (action.type === "OFF_MODAL") {
      return { showModal: false, codeValue: "", codeName: "" };
    }
  };
  const [modalState, dispatch] = useReducer(modalReducer, modalInit);

  const [currentCol, setCurrentCol] = useState();

  const keyUpHandler = (e, colInfo, coordinate) => {
    if (e.which === HELPER_KEY && colInfo.helper) {
      //도움창을 연 컬럼 좌표 저장
      setCurrentCol({ ...coordinate });
      //모달 켜기
      onModalHanlder(colInfo.value, colInfo.text);
    } else if (e.which === HELPER_KEY && !colInfo.helper) {
      console.log("도움창이 제공되지 않는 코드입니다.");
    }
  };

  //코드 선택 handler
  const selectCodeHandler = (codeRow) => {
    // console.log(codeRow);
    // console.log(tableItems);
    // console.log(currentCol);
    // console.log(modalState.codeValue);

    //================선택한 코드 테이블에 출력===============
    let copyItems = JSON.parse(JSON.stringify(tableItems));

    for (let key in codeRow) {
      let itemKey = "";

      //코드데이터면 key가 ~~Code, 아니면 value 그대로 객체 생성
      //ex) teamCode, team

      if (!key.toLowerCase().includes("code")) {
        itemKey = modalState.codeValue;
      } else {
        itemKey = key;
      }

      //같은 행에 이미 데이터가 들어있으면
      if (copyItems[currentCol.row]) {
        copyItems[currentCol.row] = {
          ...copyItems[currentCol.row],
          [itemKey]: codeRow[key],
        };
        //비어있는 행이면
      } else {
        copyItems[currentCol.row] = { [itemKey]: codeRow[key] };
      }
    }

    emitItem(copyItems);

    //======================grid2 trigger========================
    headers.forEach((header) => {
      //현재 도움창을 띄운 column이 trigger 컬럼이면
      if (header.trigger && header.value === modalState.codeValue) {
        //현재 컬럼의 header, 테이블 items, 현재 row를 보냄
        onTrigger(header, copyItems, currentCol);
      }
    });
  };

  return (
    <>
      {modalState.showModal && (
        <HelperModal
          modalState={modalState}
          offModal={offModalHandler}
          onSelectCode={selectCodeHandler}
        />
      )}
      {tableItems &&
        tableItems.map((item, idx) => (
          <tr key={idx}>
            {headers.map((header, headerIdx) =>
              //선택 컬럼
              header.value === "select" ? (
                <td key={header.value + idx}>
                  <input
                    type="checkbox"
                    onChange={() => onCheckboxChange(item)}
                  ></input>
                </td>
              ) : //순번 컬럼
              header.value === "index" ? (
                <td key={headerIdx}>{idx + 1}</td>
              ) : (
                <td key={headerIdx}>
                  {/* headerKey를 key로 가진 item 값을 출력 */}
                  {header.helper || header.readonly ? (
                    <input
                      id={`grid02_${idx}_${header.value}`}
                      readOnly
                      defaultValue={item[header.value]}
                      onKeyUp={(e) => {
                        keyUpHandler(e, header, { row: idx, col: headerIdx });
                      }}
                    ></input>
                  ) : (
                    <input
                      id={`grid02_${idx}_${header.value}`}
                      defaultValue={item[header.value]}
                      onKeyUp={(e) => {
                        keyUpHandler(e, header);
                      }}
                    ></input>
                  )}
                </td>
              )
            )}
          </tr>
        ))}
    </>
  );
}
