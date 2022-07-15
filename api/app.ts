import express, { Request, Response } from 'express';
import axios from 'axios';
import xml2js from 'xml2js';

const app = express();
const port = process.env.PORT || 4000;

app.get('/', async (_: Request, response: Response) => {
  try {
    const PDL = await axios.get('http://feeds.feedburner.com/PoorlyDrawnLines');
    const XKCD = await Promise.all(
      [...Array(10).keys()].map(comicId => axios.get(`https://xkcd.com/${comicId + 1}/info.0.json`)),
    );
    xml2js.parseString(PDL.data, (error: Error | null, json: any) => {
      if (error) throw error;
      const PDLItems = (json.rss.channel[0].item as Array<any>).map(PDLItem => ({
        type: 'PDL',
        img: PDLItem['content:encoded'][0],
        title: PDLItem.title[0],
        description: PDLItem.description[0] || 'Empty description',
        url: PDLItem.link[0],
        date: PDLItem.pubDate[0],
      }));
      const XKCDItems = XKCD.map((XKCDitem, index) => ({
        type: 'XKCD',
        img: XKCDitem.data.img,
        title: XKCDitem.data.title,
        description: XKCDitem.data.transcript,
        url: `https://xkcd.com/${index + 1}/info.0.json`,
        date: `${XKCDitem.data.month}-${XKCDitem.data.day}-${XKCDitem.data.year}`,
      }));
      response.send([...PDLItems, ...XKCDItems]);
    });
  } catch (error) {
    throw axios.isAxiosError(error) ? error : Error(JSON.stringify(error));
  }
});

app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));
