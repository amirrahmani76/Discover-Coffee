import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from '../../lib/airtable';

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    const { id } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + 1;

          // update record
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: 'coffee store could not found' });
        }
      } else {
        res.status(400);
        res.json({ message: 'Id is missing' });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: 'Error upvoting coffee store', err });
      console.error('Somting went wrong', err);
    }
  }
};

export default favouriteCoffeeStoreById;
