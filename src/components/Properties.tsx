import { useState } from "react";
import {
  PageHeader,
  Card,
  Badge,
  Btn,
  TableHead,
  Tr,
  Td,
  SectionTitle,
  PageLayout,
} from "./shared";
import { FormModal, ConfirmModal } from "./Modal";
import { useToast } from "./Toast";

type Room = {
  id: string;
  floor: number;
  type: string;
  area: string;
  rent: number;
  status: string;
  tenant: string | null;
};
type Property = {
  id: string;
  name: string;
  address: string;
  type: string;
  floors: number;
  totalRooms: number;
  rooms: Room[];
};

const initialProperties: Property[] = [
  {
    id: "P001",
    name: "Greenview Apartments",
    address: "12 Greenview Drive, Apt Complex, Metro City",
    type: "Apartment Building",
    floors: 4,
    totalRooms: 24,
    rooms: [
      {
        id: "A-101",
        floor: 1,
        type: "Studio",
        area: "32 m²",
        rent: 1500,
        status: "occupied",
        tenant: "Carlos Mendez",
      },
      {
        id: "A-102",
        floor: 1,
        type: "Studio",
        area: "30 m²",
        rent: 1450,
        status: "occupied",
        tenant: "Rita Patel",
      },
      {
        id: "A-103",
        floor: 1,
        type: "1BR",
        area: "48 m²",
        rent: 1800,
        status: "vacant",
        tenant: null,
      },
      {
        id: "A-201",
        floor: 2,
        type: "Studio",
        area: "32 m²",
        rent: 1550,
        status: "occupied",
        tenant: "Jin-ho Park",
      },
      {
        id: "A-204",
        floor: 2,
        type: "1BR",
        area: "50 m²",
        rent: 1850,
        status: "occupied",
        tenant: "Marcus Tran",
      },
      {
        id: "A-301",
        floor: 3,
        type: "2BR",
        area: "72 m²",
        rent: 2400,
        status: "occupied",
        tenant: "Liam Hartley",
      },
      {
        id: "A-401",
        floor: 4,
        type: "Penthouse",
        area: "95 m²",
        rent: 3200,
        status: "occupied",
        tenant: "Elena Vasquez",
      },
      {
        id: "A-402",
        floor: 4,
        type: "2BR",
        area: "68 m²",
        rent: 2200,
        status: "maintenance",
        tenant: null,
      },
    ],
  },
  {
    id: "P002",
    name: "Riverside Block B",
    address: "55 Riverside Road, Block B, Metro City",
    type: "Mixed-Use Block",
    floors: 3,
    totalRooms: 16,
    rooms: [
      {
        id: "B-101",
        floor: 1,
        type: "Studio",
        area: "28 m²",
        rent: 1350,
        status: "occupied",
        tenant: "Amara Diallo",
      },
      {
        id: "B-103",
        floor: 1,
        type: "1BR",
        area: "45 m²",
        rent: 1750,
        status: "occupied",
        tenant: "Sophia Okonkwo",
      },
      {
        id: "B-201",
        floor: 2,
        type: "1BR",
        area: "46 m²",
        rent: 1780,
        status: "vacant",
        tenant: null,
      },
      {
        id: "B-207",
        floor: 2,
        type: "2BR",
        area: "65 m²",
        rent: 2100,
        status: "occupied",
        tenant: "Daniel Ferreira",
      },
      {
        id: "B-301",
        floor: 3,
        type: "Studio",
        area: "30 m²",
        rent: 1400,
        status: "occupied",
        tenant: "Yuki Nakamura",
      },
    ],
  },
  {
    id: "P003",
    name: "Sunset Terrace",
    address: "8 Sunset Boulevard, Metro City",
    type: "Terrace Houses",
    floors: 2,
    totalRooms: 12,
    rooms: [
      {
        id: "C-101",
        floor: 1,
        type: "2BR",
        area: "70 m²",
        rent: 2000,
        status: "vacant",
        tenant: null,
      },
      {
        id: "C-102",
        floor: 1,
        type: "2BR",
        area: "72 m²",
        rent: 2050,
        status: "occupied",
        tenant: "Priya Mehta",
      },
      {
        id: "C-205",
        floor: 2,
        type: "3BR",
        area: "95 m²",
        rent: 2800,
        status: "occupied",
        tenant: "Tom & Sarah Blake",
      },
    ],
  },
];

const statusColor: Record<string, "green" | "amber" | "red" | "gray"> = {
  occupied: "green",
  vacant: "gray",
  maintenance: "amber",
  reserved: "amber",
};

const blank = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, ""]));

export default function Properties() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property>(
    initialProperties[0],
  );

  const [showAddProperty, setShowAddProperty] = useState(false);
  const [propForm, setPropForm] = useState(
    blank(["name", "address", "type", "floors"]),
  );

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [roomForm, setRoomForm] = useState(
    blank(["id", "floor", "type", "area", "rent", "status"]),
  );

  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);

  const saveProperty = () => {
    if (!propForm.name.trim()) {
      toast("Property name is required", "error");
      return;
    }
    const newProp: Property = {
      id: `P00${properties.length + 1}`,
      name: propForm.name,
      address: propForm.address,
      type: propForm.type || "Apartment Building",
      floors: Number(propForm.floors) || 1,
      totalRooms: 0,
      rooms: [],
    };
    const updated = [...properties, newProp];
    setProperties(updated);
    setSelectedProperty(newProp);
    setShowAddProperty(false);
    setPropForm(blank(["name", "address", "type", "floors"]));
    toast(`Property "${newProp.name}" added successfully`, "success");
  };

  const saveRoom = () => {
    if (!roomForm.id.trim() || !roomForm.rent) {
      toast("Room ID and rent are required", "error");
      return;
    }
    const newRoom: Room = {
      id: roomForm.id,
      floor: Number(roomForm.floor) || 1,
      type: roomForm.type || "Studio",
      area: roomForm.area || "—",
      rent: Number(roomForm.rent),
      status: roomForm.status || "vacant",
      tenant: null,
    };
    const updated = properties.map((p) =>
      p.id === selectedProperty.id
        ? { ...p, rooms: [...p.rooms, newRoom], totalRooms: p.totalRooms + 1 }
        : p,
    );
    setProperties(updated);
    setSelectedProperty(updated.find((p) => p.id === selectedProperty.id)!);
    setShowAddRoom(false);
    setRoomForm(blank(["id", "floor", "type", "area", "rent", "status"]));
    toast(`Room ${newRoom.id} added`, "success");
  };

  const saveEditRoom = () => {
    if (!editRoom) return;
    const updated = properties.map((p) =>
      p.id === selectedProperty.id
        ? {
            ...p,
            rooms: p.rooms.map((r) =>
              r.id === editRoom.id
                ? {
                    ...r,
                    ...editForm,
                    rent: Number(editForm.rent),
                    floor: Number(editForm.floor),
                  }
                : r,
            ),
          }
        : p,
    );
    setProperties(updated);
    setSelectedProperty(updated.find((p) => p.id === selectedProperty.id)!);
    setEditRoom(null);
    toast(`Room ${editRoom.id} updated`, "success");
  };

  const confirmDeleteRoom = () => {
    if (!deleteRoom) return;
    const updated = properties.map((p) =>
      p.id === selectedProperty.id
        ? {
            ...p,
            rooms: p.rooms.filter((r) => r.id !== deleteRoom.id),
            totalRooms: p.totalRooms - 1,
          }
        : p,
    );
    setProperties(updated);
    setSelectedProperty(updated.find((p) => p.id === selectedProperty.id)!);
    setDeleteRoom(null);
    toast(`Room ${deleteRoom.id} removed`, "info");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Properties & Rooms"
        subtitle="Manage buildings, units, and room status"
        action={
          <Btn onClick={() => setShowAddProperty(true)}>+ Add Property</Btn>
        }
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "280px 1fr" }}>
        {/* Property list */}
        <div className="flex flex-col gap-3">
          {properties.map((p) => {
            const occupied = p.rooms.filter(
              (r) => r.status === "occupied",
            ).length;
            const isActive = selectedProperty.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProperty(p)}
                style={{
                  background: isActive ? "var(--primary)" : "var(--card)",
                  border: isActive ? "none" : "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "#A7D4B8" : "var(--muted-foreground)",
                    letterSpacing: "0.06em",
                    marginBottom: "4px",
                  }}
                >
                  {p.id} · {p.type}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isActive ? "white" : "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: isActive ? "#A7D4B8" : "var(--muted-foreground)",
                    marginBottom: "10px",
                  }}
                >
                  {p.address}
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      fontSize: "18px",
                      color: isActive ? "white" : "var(--foreground)",
                    }}
                  >
                    {occupied}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: isActive ? "#A7D4B8" : "var(--muted-foreground)",
                      marginLeft: "4px",
                    }}
                  >
                    / {p.rooms.length} rooms
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Room table */}
        <Card className="self-start">
          <div className="flex items-start justify-between mb-5">
            <div>
              <SectionTitle>{selectedProperty.name}</SectionTitle>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  marginTop: "-10px",
                }}
              >
                {selectedProperty.address}
              </p>
            </div>
            <Btn size="sm" onClick={() => setShowAddRoom(true)}>
              + Add Room
            </Btn>
          </div>
          {selectedProperty.rooms.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                color: "var(--muted-foreground)",
                fontSize: "13px",
              }}
            >
              No rooms yet. Click "+ Add Room" to get started.
            </div>
          ) : (
            <table className="w-full">
              <TableHead
                cols={[
                  "Room",
                  "Floor",
                  "Type",
                  "Area",
                  "Rent/mo",
                  "Status",
                  "Tenant",
                  "",
                ]}
              />
              <tbody>
                {selectedProperty.rooms.map((r, i) => (
                  <Tr key={i}>
                    <Td mono>{r.id}</Td>
                    <Td mono>{r.floor}</Td>
                    <Td>{r.type}</Td>
                    <Td mono>{r.area}</Td>
                    <Td mono>${r.rent.toLocaleString()}</Td>
                    <Td>
                      <Badge color={statusColor[r.status] ?? "gray"}>
                        {r.status}
                      </Badge>
                    </Td>
                    <Td>
                      {r.tenant ?? (
                        <span
                          style={{
                            color: "var(--muted-foreground)",
                            fontSize: "12px",
                          }}
                        >
                          —
                        </span>
                      )}
                    </Td>
                    <Td>
                      <div className="flex gap-1">
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditRoom(r);
                            setEditForm({
                              id: r.id,
                              floor: String(r.floor),
                              type: r.type,
                              area: r.area,
                              rent: String(r.rent),
                              status: r.status,
                            });
                          }}
                        >
                          Edit
                        </Btn>
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteRoom(r)}
                        >
                          Remove
                        </Btn>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* Add Property Modal */}
      <FormModal
        open={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        title="Add New Property"
        fields={[
          {
            label: "Property Name",
            name: "name",
            placeholder: "e.g. Oakwood Residences",
            required: true,
          },
          { label: "Address", name: "address", placeholder: "Full address" },
          {
            label: "Type",
            name: "type",
            type: "select",
            options: [
              "Apartment Building",
              "Mixed-Use Block",
              "Terrace Houses",
              "Commercial Block",
            ],
          },
          {
            label: "Number of Floors",
            name: "floors",
            type: "number",
            placeholder: "e.g. 4",
          },
        ]}
        values={propForm}
        onChange={(n, v) => setPropForm((f) => ({ ...f, [n]: v }))}
        onSubmit={saveProperty}
        submitLabel="Add Property"
      />

      {/* Add Room Modal */}
      <FormModal
        open={showAddRoom}
        onClose={() => setShowAddRoom(false)}
        title={`Add Room — ${selectedProperty.name}`}
        fields={[
          {
            label: "Room",
            name: "id",
            type: "select",
            options: selectedProperty.rooms.map((room) => room.id),
            required: true,
          },
          { label: "Floor", name: "floor", type: "number", placeholder: "1" },
          {
            label: "Type",
            name: "type",
            type: "select",
            options: ["Studio", "1BR", "2BR", "3BR", "Penthouse", "Office"],
          },
          { label: "Area", name: "area", placeholder: "e.g. 45 m²" },
          {
            label: "Monthly Rent ($)",
            name: "rent",
            type: "number",
            placeholder: "e.g. 1800",
            required: true,
          },
          {
            label: "Status",
            name: "status",
            type: "select",
            options: ["vacant", "occupied", "maintenance", "reserved"],
          },
        ]}
        values={roomForm}
        onChange={(n, v) => setRoomForm((f) => ({ ...f, [n]: v }))}
        onSubmit={saveRoom}
        submitLabel="Add Room"
      />

      {/* Edit Room Modal */}
      <FormModal
        open={!!editRoom}
        onClose={() => setEditRoom(null)}
        title={`Edit Room — ${editRoom?.id}`}
        fields={[
          { label: "Floor", name: "floor", type: "number" },
          {
            label: "Type",
            name: "type",
            type: "select",
            options: ["Studio", "1BR", "2BR", "3BR", "Penthouse", "Office"],
          },
          { label: "Area", name: "area" },
          { label: "Monthly Rent ($)", name: "rent", type: "number" },
          {
            label: "Status",
            name: "status",
            type: "select",
            options: ["vacant", "occupied", "maintenance", "reserved"],
          },
        ]}
        values={editForm}
        onChange={(n, v) => setEditForm((f) => ({ ...f, [n]: v }))}
        onSubmit={saveEditRoom}
        submitLabel="Save Changes"
      />

      {/* Delete Room Confirm */}
      <ConfirmModal
        open={!!deleteRoom}
        onClose={() => setDeleteRoom(null)}
        onConfirm={confirmDeleteRoom}
        title="Remove Room"
        message={`Are you sure you want to remove room ${deleteRoom?.id}? This action cannot be undone.`}
        confirmLabel="Remove Room"
        danger
      />
    </PageLayout>
  );
}
