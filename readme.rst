:author: Lukas Turcani

This is a very simple plotter of voxels. Open ``src/voxelplot.html`` in
your browser and it should run. There is a file picker at the top of
the page. Your file will not be uploaded, its all offline.

The file must be in the following format

.. code-block:: javascript

    [
        [x, y, z],
        [x, y, z],
        [x, y, z]
    ]

Each ``[x, y, z]`` represents a voxel on the grid to be rendered. The
``[x, y, z]`` represents the position of the voxel in the grid. You
can see an example in ``example_file.json``.

Here is an example from a different file:

.. figure:: figures/example.gif
