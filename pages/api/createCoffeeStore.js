import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
  //because default request method is GET
  if (req.method === 'POST') {
    //find a record

    const { id, name, address, neighbourhood, voting, imgUrl } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.json(records);
        } else {
          //create record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: 'id or name is missing' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'id is missing' });
      }
    } catch (err) {
      console.error('Error Creating or Finding a store', err);
      res.status(500);
      res.json({ message: 'Error Creating or Finding a store', err });
    }
  }
};

export default createCoffeeStore;
