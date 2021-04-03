db.masterdata.insertMany([
    {
        "_id": ObjectId("59cea444f046d63490cc6646"),
        "name": "Contract 1",
        "description": "Test-Contract Nr. 1",
        "parent": null,
        "children": [
            ObjectId("59cea4baf046d63490cc6656"),
            ObjectId("59cea549f046d63490cc6665")
        ]
    },
    {
        "_id": ObjectId("59cea4baf046d63490cc6656"),
        "name": "Booking 1-1",
        "description": "Booking 1 in Contract 1 ",
        "parent": ObjectId("59cea444f046d63490cc6646"),
        "children": [
            ObjectId("59cf949eb6427a3d27d97cda"),
            ObjectId("59cf94afb6427a3d27d97cde")
        ]
    },
    {
        "_id": ObjectId("59cea549f046d63490cc6665"),
        "name": "Booking 1-2",
        "description": "Booking 2 in Contract 1 ",
        "parent": ObjectId("59cea444f046d63490cc6646"),
        "children": []
    },
    {
        "_id": ObjectId("59ceb136f046d63490cc6828"),
        "name": "Contract 2",
        "description": "Test-Contract Nr. 2",
        "parent": null,
        "children": [
            ObjectId("59cf92fcb6427a3d27d97c9f")
        ]
    },
    {
        "_id": ObjectId("59cf92fcb6427a3d27d97c9f"),
        "name": "Booking 2-1",
        "description": "Booking 1 in Contract 2 ",
        "parent": ObjectId("59ceb136f046d63490cc6828"),
        "children": [
            ObjectId("59cf9363b6427a3d27d97cb1")
        ]
    },
    {
        "_id": ObjectId("59cf9363b6427a3d27d97cb1"),
        "name": "Booking-Position 2-1-1",
        "description": "Position 1 in Booking 1 of Contract 2",
        "parent": ObjectId("59cf92fcb6427a3d27d97c9f"),
        "children": []
    },
    {
        "_id": ObjectId("59cf949eb6427a3d27d97cda"),
        "name": "Booking-Position 1-1-1",
        "description": "Position 1 in Booking 1 of Contract 1 ",
        "parent": ObjectId("59cea4baf046d63490cc6656"),
        "children": []
    },
    {
        "_id": ObjectId("59cf94afb6427a3d27d97cde"),
        "name": "Booking-Position 1-1-2",
        "description": "Position 2 in Booking 1 of Contract 1 ",
        "parent": ObjectId("59cea4baf046d63490cc6656"),
        "children": []
    }
]);