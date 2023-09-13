/**
 * helpful when importing json file of collection into mongodb
 * exported mongo json collection have _id and date object in disorder,
 * to transform this nested object in proper format for mongoose
 * use this function transformObject.
 */
const objects = { id: "$oid", date: "$date" };
function transformObject(obj) {
  let newobj = {};
  try {
    if (obj != null && obj != undefined) {
      Object.keys(obj).forEach((key) => {
        if (
          typeof obj[key] === "object" &&
          !Array.isArray(obj[key]) &&
          obj[key] != null &&
          obj[key] != undefined
        ) {
          if (obj[key][objects.id]) {
            newobj[key] = new mongoose.Types.ObjectId(obj[key][objects.id]);
          }

          if (obj[key][objects.date]) {
            newobj[key] = new Date(obj[key][objects.date]);
          }

          if (Object.keys(obj[key]).length > 1) {
            newobj[key] = transformObject(obj[key]);
          }
        } else if (typeof obj[key] === "object" && Array.isArray(obj[key])) {
          newobj[key] = [];
          obj[key].forEach((itm) => {
            newobj[key].push(transformObject(itm));
          });
        } else {
          newobj[key] = obj[key];
        }
      });
      return newobj;
    }
  } catch (error) {
    console.log(error);
  }
}
