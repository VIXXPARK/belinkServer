const view_name = "useableVisits";
const viewQuery =
  "CREATE OR REPLACE VIEW useableVisits AS SELECT v.id as myId, DAYOFWEEK(v.createdAt) as myDay, HOUR(v.createdAt) as myHour, IFNULL((SELECT s2.storeType FROM visits as v2 LEFT JOIN stores as s2 ON v2.storeId = s2.id WHERE TIMEDIFF((SELECT createdAt FROM visits WHERE id = myId), v2.createdAt) BETWEEN '00:00:01' AND '3:00:00' AND v2.userId = (SELECT userId FROM visits WHERE id = myId) ORDER BY v2.createdAt desc LIMIT 1),'none') AS prior, s.storeType FROM visits as v LEFT JOIN stores as s ON v.storeId = s.id WHERE v.storeId = s.id";

module.exports = (sequelize, DataTypes) => {
  sequelize.query(viewQuery);

  return sequelize.define(
    "useableVisit",
    {
      myId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      myDay: {
        type: DataTypes.INTEGER,
      },
      myHour: {
        type: DataTypes.INTEGER,
      },
      prior: {
        type: DataTypes.STRING,
      },
      storeType: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
      tableName: "useableVisits",
    }
  );
};
