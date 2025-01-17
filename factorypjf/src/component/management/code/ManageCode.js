import React from "react";

const ManageCode = ({ manageCodeAll, setSelectId, selectId }) => {
  return (
    <div>
      <div className="ctable">
        <div className="chead">
          <div className="ctr code_row">
            <div>관리코드</div>
            <div>관리코드명</div>
          </div>
        </div>
      </div>

      <div className="ctable">
        <div className="cbody">
          {manageCodeAll &&
            manageCodeAll.map((data) => (
              <div className="ctr code_row" onClick={() => setSelectId(data)}>
                <div
                  style={{
                    backgroundColor:
                      selectId?.management_code == data.management_code
                        ? "#dadada"
                        : "transparent",
                  }}
                >
                  {data.management_code}
                </div>
                <div
                  style={{
                    backgroundColor:
                      selectId?.management_code == data.management_code
                        ? "#dadada"
                        : "transparent",
                  }}
                >
                  {data.management_name}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCode;
