// 将表格中的值转为可读的中文
// datas[{},{}]
const tableToChinese = (datas) => {
    for (let data of datas) {
        // 品牌
        switch (data.brand) {
            case "Sony":
                data.brand = "索尼";
                break;
            case "Panasonic":
                data.brand = "松下";
                break;
            case "Nikon":
                data.brand = "尼康";
                break;
            case "Canon":
                data.brand = "佳能";
                break;
            case "Fuji":
                data.brand = "富士";
                break;
            case "Pentax":
                data.brand = "宾得";
                break;
            case "Yongnuo":
                data.brand = "永诺";
                break;
            case "Zeiss":
                data.brand = "蔡司";
                break;
            case "TTartisan":
                data.brand = "铭匠";
                break;
            case "Sigma":
                data.brand = "适马";
                break;
            case "Tamron":
                data.brand = "腾龙";
                break;
            case "Tokina":
                data.brand = "图丽";
                break;
            case "Viltrox":
                data.brand = "唯卓仕";
                break;
            case "AstrHori":
                data.brand = "岩石星";
                break;
        }
        // 画幅
        switch (data.frame) {
            case "FX":
                data.frame = "全画幅";
                break;
            case "DX":
                data.frame = "半画幅";
                break;
        }
        // 焦段信息
        if (data.max_focal != data.min_focal) {
            data.min_focal = data.min_focal + " - " + data.max_focal;
        }
        // 是否变焦
        switch (data.zoom) {
            case 1:
                data.zoom = "变焦"
                break;
            case 0:
                data.zoom = "定焦"
                break;
        }
    }
}

export default tableToChinese