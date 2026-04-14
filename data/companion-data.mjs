export class CompanionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      details: new fields.SchemaField({
        level: new fields.NumberField({
          required: true,
          integer: true,
          min: 0,
          initial: 0
        })
      }),

      stats: new fields.SchemaField({
        move: new fields.NumberField({
          required: true,
          integer: true,
          min: 0,
          initial: 6
        }),
        fight: new fields.NumberField({
          required: true,
          integer: true,
          initial: 0
        }),
        shoot: new fields.NumberField({
          required: true,
          integer: true,
          initial: 0
        }),
        armour: new fields.NumberField({
          required: true,
          integer: true,
          min: 0,
          initial: 10
        }),
        will: new fields.NumberField({
          required: true,
          integer: true,
          initial: 0
        }),
        health: new fields.SchemaField({
          max: new fields.NumberField({
            required: true,
            integer: true,
            min: 0,
            initial: 10
          }),
          current: new fields.NumberField({
            required: true,
            integer: true,
            min: 0,
            initial: 10
          })
        })
      })
    };
  }
}
