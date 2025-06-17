export async function webGPUCheck(): Promise<boolean> {
  // check to see if navigator.gpu exists and if we can create a device
  if ((navigator as any).gpu) {
    try {
      const gpu = await (navigator as any).gpu.requestAdapter();
      return gpu ? true : false;
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }
  else {
    return false;
  }
}