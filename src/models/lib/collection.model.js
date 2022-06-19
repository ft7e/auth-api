'use strict';

class Collection {
  constructor(model) {
    this.model = model;
  }
  async create(obj) {
    try {
      let record = await this.model.create(obj);
      return record;
    } catch (e) {
      console.log('Error  creating in model, ', this.model);
    }
  }
  async read(data_id) {
    try {
      if (data_id) {
        let findElement = await this.model.findOne({ where: { id: data_id } });
        return findElement;
      } else if (typeof data_id === 'undefined') {
        console.log(data_id);
        let record = await this.model.findAll();
        return record;
      }
    } catch (e) {
      console.log('Error in reading  model, ', this.model);
    }
  }
  async update(obj) {
    try {
      let updated = await this.model.update(obj);
      return updated;
    } catch (e) {
      console.error('error in updating record in model ', this.model);
    }
  }
  async delete(data_id) {
    if (!data_id) {
      throw new Error('no id provided for model ', this.model);
    }
    try {
      let deleted = await this.model.destroy({ where: { id: data_id } });
      return { Condition: 'Success' };
    } catch (e) {
      console.error('error in deleting record in model ', this.model);
    }
  }
}
module.exports = Collection;
