const User = require('../User/user.model');
const Direccion = require('./direccion.model');



exports.getDireccion = async (request, response) =>{
  try {
    console.log(request.user)
    let direccion = await Direccion.findById(request.user.Direccion);
    response.json(direccion);
  } catch (error) {
    console.log(error)
  }
}

exports.getUserDireccion = async(request, response) =>{
  try {
    console.log(request.user)
    let direccion = await Direccion.findById(request.params.id);
    if(!direccion) response.status(404);
    response.status(202).json(direccion);
  } catch (error) {
    console.log(error);
  }
}


exports.ActualizarDireccion = async (request, response) => {
  try {
    console.log(request.user.Direccion.toHexString())
    if(request.user.Direccion){
        let direccion = await Direccion.findByIdAndUpdate(request.user.Direccion.toHexString(),{...request.body});
        if(!direccion){
            const user = await User.findById(request.user._id);
        if (!user) {
        return response.status(404).send({ message: 'Usuario no encontrado' });
        }

        direccion = new Direccion({...request.body, User : request.user._id});
        direccion.save();
        

        user.Direccion = direccion;
        await user.save();
   

        }
        response.send(direccion);
    }else{
        const user = await User.findById(request.user._id);
        if (!user) {
        return response.status(404).send({ message: 'Usuario no encontrado' });
        }

        const direccion = new Direccion({...request.body, User : request.user._id});
        direccion.save();
        

        user.Direccion = direccion;
        const savedUser = await user.save();

        response.send(savedUser);

    }


  } catch (error) {
    console.error(error);
    response.status(500).send({ message: 'Ocurrió un error al actualizar la dirección' });
  }
};