import Modal from "component/storage/item/Modal";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { partnerAction } from "redux/actions/management/partnerAction";
import { unitPriceAction } from "redux/actions/management/unitPriceAction";
import api from "redux/api";

const UnitPriceList = ({ itemAll }) => {
  const dispatch = useDispatch();
  const { partnerAll } = useSelector((state) => state.partner);
  const { unitPriceAll } = useSelector((state) => state.unitPrice);

  useEffect(() => {
    dispatch(partnerAction.getPartnerAll());
    dispatch(unitPriceAction.getCurrentUnitPriceAll());
  }, []);

  // flag값의 변화에따라 리스트 db요청
  const [listFalg, setListFlag] = useState("current");
  useEffect(() => {
    if (listFalg == "current") {
      dispatch(unitPriceAction.getCurrentUnitPriceAll());
    }

    if (listFalg == "expected") {
      dispatch(unitPriceAction.getExpectedUnitPriceAll());
    }

    if (listFalg == "all") {
      dispatch(unitPriceAction.getUnitPriceAll());
    }

    setFormData({
      item_code: "",
      item_name: "",
      partner_code: "",
      partner_name: "",
      type: "",
      start_date: "",
    });
  }, [listFalg]);

  useEffect(() => {
    setSearchList(unitPriceAll.data);
    filterData();
  }, [unitPriceAll]);

  //#region 검색

  const [searchList, setSearchList] = useState(unitPriceAll?.data);
  const [formData, setFormData] = useState({
    item_code: "",
    item_name: "",
    partner_code: "",
    partner_name: "",
    type: "",
    start_date: "",
  });

  const filterData = () => {
    setSearchList(
      unitPriceAll?.data?.filter((data) => {
        let valid = true;
        if (formData.item_code && data.item_code !== formData.item_code) {
          valid = false;
        }
        if (
          formData.partner_code &&
          data.partner_code !== formData.partner_code
        ) {
          valid = false;
        }
        if (formData.type && data.type !== formData.type) {
          valid = false;
        }
        return valid;
      })
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    setFormData({
      ...formData,
      partner_name: partnerAll?.data?.find(
        (data) => data.partner_code == formData["partner_code"]
      )?.partner_name,
    });
  }, [formData.partner_code]);

  const itemCode = {
    name: "품목",
    guide: true,
    type_all: "itemAll",
    code_column: "item_code",
    name_column: "item_name",
    dataAll: { itemAll },
    trigger_type: "search",
    input_type: "item",
  };

  const partnerCode = {
    name: "거래처",
    guide: true,
    type_all: "partnerAll",
    code_column: "partner_code",
    name_column: "partner_name",
    dataAll: { partnerAll },
    trigger_type: "search",
  };
  //#endregion

  function delvalue(e) {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name + "_code"]: "",
      [e.target.name + "_name"]: "",
    });
    console.log(formData);
  }

  const handleCheckboxChange = (cd) => {
    if (selectCodes.includes(cd)) {
      setSelectCodes((prev) => prev.filter((itemCd) => itemCd !== cd));
    } else {
      setSelectCodes((prev) => [...prev, cd]);
    }
  };

  // #region 삭제
  const [selectCodes, setSelectCodes] = useState([]);

  const handleDelete = async (e) => {
    e.preventDefault();
    await api.post("/unitprice/delete", selectCodes);
    dispatch(partnerAction.getPartnerAll());
    setSelectCodes([]);
  };
  // #endregion

  return (
    <div>
      <form className="unit_price_search_form mt-4">
        <div>
          <div>
            <div>품목이름</div>
            <div className="flex">
              <input
                readOnly
                type="text"
                onChange={handleInputChange}
                value={formData["item_name"]}
              ></input>
              {formData["item_code"] != "" && (
                <div>
                  <button
                    name="item"
                    onClick={delvalue}
                    style={{ width: "20px", color: "red", background: "#fff" }}
                  >
                    x
                  </button>
                </div>
              )}
              <Modal menu={itemCode} handleInputChange={handleInputChange} />
            </div>
          </div>
          <div>
            <div>거래처</div>
            <div className="flex">
              <input
                tyep="text"
                name="partner_name"
                onChange={handleInputChange}
                value={formData["partner_name"]}
              ></input>
              <Modal menu={partnerCode} handleInputChange={handleInputChange} />
            </div>
          </div>
          <div>
            <div>입고/출고</div>
            <div>
              <select name="type" onChange={handleInputChange}>
                <option value=""></option>
                <option value="inbound">입고</option>
                <option value="outbound">출고</option>
              </select>
            </div>
          </div>
          <div>
            <div>시작일</div>
            <div>
              <input
                tyep="text"
                name="itme_code"
                onChange={handleInputChange}
              ></input>
            </div>
          </div>
        </div>
        <div>
          <button type="button" className="button" onClick={filterData}>
            조회
          </button>
        </div>
      </form>
      <div className="unit_price_tab_wrap">
        <div
          onClick={() => setListFlag("current")}
          style={{ backgroundColor: listFalg == "current" ? "#4473BF" : "" }}
        >
          현재단가
        </div>
        <div
          onClick={() => setListFlag("expected")}
          style={{ backgroundColor: listFalg == "expected" ? "#4473BF" : "" }}
        >
          변경예정단가
        </div>
        <div
          onClick={() => setListFlag("all")}
          style={{ backgroundColor: listFalg == "all" ? "#4473BF" : "" }}
        >
          전체
        </div>
      </div>

      <div className="ctable">
        <div className="chead" style={{ width: "99.2%" }}>
          <div className="ctr unitprice_row">
            <div></div>
            <div>품목코드</div>
            <div>품목이름</div>
            <div>거래처</div>
            <div>단가</div>
            <div>입고/출고</div>
            <div>시작일</div>
            <div>종료일</div>
          </div>
        </div>
      </div>
      <div className="ctable">
        <div className="cbody">
          {unitPriceAll &&
            searchList?.map((data) => (
              <div className="ctr unitprice_row">
                <div>
                  <input
                    type="checkbox"
                    checked={selectCodes?.includes(data?.partner_code)}
                    onChange={() => handleCheckboxChange(data?.partner_code)}
                  />
                </div>
                <div>{data.item_code}</div>
                <div>
                  {
                    itemAll?.data?.find(
                      (idata) => idata.item_code == data.item_code
                    )?.item_name
                  }
                </div>
                <div>
                  {
                    partnerAll?.data?.find(
                      (pdata) => pdata.partner_code == data.partner_code
                    ).partner_name
                  }
                </div>
                <div>{parseInt(data.unit_price, 10).toLocaleString()}</div>
                <div>{data.type == "inbound" ? "입고" : "출고"}</div>
                <div>{data.start_date}</div>
                <div>{data.end_date}</div>
              </div>
            ))}
        </div>
      </div>
      <div className="button_wrap">
        <button
          disabled={selectCodes.length > 0 ? false : true}
          className="button"
          style={{
            backgroundColor: selectCodes.length > 0 ? "red" : "#dadada",
          }}
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default UnitPriceList;
