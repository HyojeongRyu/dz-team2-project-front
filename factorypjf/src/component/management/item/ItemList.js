import React, { useEffect, useState } from "react";
import api from "../../../redux/api";
import { useDispatch, useSelector } from "react-redux";
import { codeAction } from "redux/actions/management/codeAction";

const ItemList = ({
  itemAll,
  setSelectItem,
  selectIds,
  setSelectIds,
  selectItem,
}) => {
  const dispatch = useDispatch();
  const [itemList, setItemList] = useState(itemAll.data);
  const { codeAll } = useSelector((state) => state.code);

  useEffect(() => {
    dispatch(codeAction.getCodeAll());
  }, []);

  const handleCheckboxChange = (id) => {
    if (selectIds.includes(id)) {
      setSelectIds((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setSelectIds((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    setItemList(itemAll.data);
  }, [itemAll]);

  const [formData, setFormData] = useState({
    item_name: "",
    item_code: "",
  });

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
    };

    try {
      setItemList((await api.post("/item/search", submitData)).data.data);
    } catch (error) {
      console.log("error :", error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(codeAll);
  };

  return (
    <div>
      <div className="item_search_wrap">
        <form>
          <div>
            <div style={{ marginRight: "20px" }}>
              <div>
                <div>품목코드</div>
                <div>
                  <input
                    type="text"
                    name="item_code"
                    onChange={handleSearchChange}
                    style={{ marginRight: "20px" }}
                  />
                </div>
              </div>
              <div>
                <div>품목이름</div>
                <div>
                  <input
                    type="text"
                    name="item_name"
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="button"
              onClick={handleSearchSubmit}
            >
              조회
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="ctable">
          <div className="chead">
            <div className="ctr item_row">
              <div></div>
              <div>품목코드</div>
              <div>품목이름</div>
              <div>규격</div>
              <div>단위</div>
            </div>
          </div>
        </div>

        <div className="ctable">
          <div className="cbody">
            {itemList.length > 0 &&
              itemList.map((data) => (
                <div
                  className="ctr item_row"
                  onClick={() => setSelectItem(data)}
                  style={{
                    backgroundColor:
                      selectItem?.item_code == data?.item_code ? "#dadada" : "",
                  }}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectIds.includes(data.item_code)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(data.item_code);
                      }}
                    />
                  </div>
                  <div>{data.item_code}</div>
                  <div>{data.item_name}</div>
                  <div>
                    {codeAll &&
                      codeAll?.data?.find(
                        (cdata) =>
                          cdata.management_code == "STANDARD" &&
                          cdata.common_code == data.standard
                      )?.common_name}
                  </div>
                  <div>{data.unit}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
