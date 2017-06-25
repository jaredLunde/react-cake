export default ({width, height}) => ({
  orientation: width > height ? 'landscape' :
                                width === height ? 'square' : 'portrait'
})
