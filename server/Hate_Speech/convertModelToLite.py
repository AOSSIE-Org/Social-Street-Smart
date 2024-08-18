import tensorflow as tf
from tensorflow.keras.models import model_from_json

# Load the model architecture from JSON file
with open('hate_speech_api/resources/lstm_hate_speech.json', 'r') as json_file:
    model_json = json_file.read()
model = model_from_json(model_json)

# Load the weights into the model
model.load_weights('./hate_speech_api/resources/lstm_hate_speech.weights.h5')

# Optionally, recompile the model if necessary
model.compile(
    loss='binary_crossentropy',
    optimizer='adam',
    metrics=['accuracy']
)

# Convert the model to TensorFlow Lite format
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Enable support for TensorFlow operations
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS, tf.lite.OpsSet.SELECT_TF_OPS]

# Disable experimental lowering of tensor list ops
converter._experimental_lower_tensor_list_ops = False

# Enable resource variables if required
# converter.experimental_enable_resource_variables = True

# Convert the model
tflite_model = converter.convert()

# Save the TFLite model to a file
with open('hate_speech_api/resources/lstm_hate_speech.tflite', 'wb') as f:
    f.write(tflite_model)

print("TFLite model has been successfully converted and saved.")
