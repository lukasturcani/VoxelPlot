:author: Lukas Turcani

This is a very simple plotter of voxels. Open ``src/voxelplot.html`` in
your browser and it should run. There is a file picker at the top of
the page. Your file will not be uploaded, its all offline.

The file must be in the following format

.. code-block:: javascript

    [
        [state, [x, y, z]],
        [state, [x, y, z]],
        [state, [x, y, z]]
    ]

Each ``[state, [x, y, z]]`` represents a voxel on the grid to be
rendered. The ``state`` can be ``0`` or ``1`` to indicate whether the
voxel should be rendered or not. The ``[x, y, z]`` represent the
position of the voxel in the grid. You can see an example in
``example_file.json``.

Here is an example from a different file:

.. figure:: figures/example.gif
