import { getIv } from '../main/fortuna';

describe('fortuna', () => {
  it('should generate iv', async () => {
    const iv = await getIv();
    expect(iv.length).toBe(16);
  });
});
