For the better part of the last decade, Convolutional Neural Networks (CNNs) have reigned supreme in computer vision. Their translation invariance and local inductive bias made them perfect for understanding images. However, the introduction of the Vision Transformer (ViT) marked a paradigm shift.

Breaking the Grid

Unlike CNNs, which process pixels in rigid grids, Transformers treat images as sequences of patches. This allows the model to attend to global context from the very first layer.

"The removal of inductive bias is not a bug, but a feature."

In our experiments at Spectrum Lab, we've observed that while ViTs lack the inductive bias of CNNs—requiring more data to train—they scale remarkably well.