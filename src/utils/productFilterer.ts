export default class productFilterer {
  query: any;
  queryStr: any;
  constructor(query: any, queryStr: any) {
    this.query = this.filter(query, queryStr);
    this.query = this.pagination(query, queryStr);
    this.query = this.sort(query, queryStr);
    this.queryStr = queryStr;
  }
  filter(query: any, queryStr: any) {
    let queryObj = { ...queryStr };
    let excludedFields = ["page", "sort", "fields", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let filterConditions: any = {};

    for (const element in queryObj) {
      if (element == "title") {
        filterConditions[element] = {
          $regex: queryObj[element],
          $options: "i",
        };
        continue;
      }

      let value = queryObj[element];
      let filterValue = value.split(",");

      if (filterValue.length == 1) {
        filterConditions[element] = filterValue[0];
        continue;
      }

      filterValue = filterValue.map((el: any) => {
        return el.replace(/(gt|gte|lt|lte)/g, (match: any) => `$${match}`);
      });

      if (!isNaN(filterValue[1])) {
        filterValue[1] = parseInt(filterValue[1]);
      }

      filterConditions[element] = { [filterValue[0]]: filterValue[1] };
    }

    return query.find(filterConditions);
  }
  pagination(query: any, queryStr: any) {
    let page = parseInt(queryStr.page) || 1;
    let limit = parseInt(queryStr.limit) || 100;
    let skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    return query;
  }
  sort(query: any, queryStr: any) {
    if (queryStr.sort) {
      let sortBy = queryStr.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    return query;
  }
}
