# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: face.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from . import common_pb2
from . import rect_pb2
from . import landmark_pb2
from . import mat_pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='face.proto',
  package='flib.proto',
  serialized_pb=_b('\n\nface.proto\x12\nflib.proto\x1a\x0c\x63ommon.proto\x1a\nrect.proto\x1a\x0elandmark.proto\x1a\tmat.proto\"\x81\x01\n\x04\x46\x61\x63\x65\x12\x12\n\ntrack_uuid\x18\x01 \x01(\t\x12\x1e\n\x04rect\x18\x02 \x02(\x0b\x32\x10.flib.proto.Rect\x12\'\n\tlandmarks\x18\x03 \x03(\x0b\x32\x14.flib.proto.Landmark\x12\x1c\n\x03mat\x18\x04 \x01(\x0b\x32\x0f.flib.proto.Mat')
  ,
  dependencies=[common_pb2.DESCRIPTOR,rect_pb2.DESCRIPTOR,landmark_pb2.DESCRIPTOR,mat_pb2.DESCRIPTOR,])
_sym_db.RegisterFileDescriptor(DESCRIPTOR)




_FACE = _descriptor.Descriptor(
  name='Face',
  full_name='flib.proto.Face',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='track_uuid', full_name='flib.proto.Face.track_uuid', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='rect', full_name='flib.proto.Face.rect', index=1,
      number=2, type=11, cpp_type=10, label=2,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='landmarks', full_name='flib.proto.Face.landmarks', index=2,
      number=3, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='mat', full_name='flib.proto.Face.mat', index=3,
      number=4, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=80,
  serialized_end=209,
)

_FACE.fields_by_name['rect'].message_type = rect_pb2._RECT
_FACE.fields_by_name['landmarks'].message_type = landmark_pb2._LANDMARK
_FACE.fields_by_name['mat'].message_type = mat_pb2._MAT
DESCRIPTOR.message_types_by_name['Face'] = _FACE

Face = _reflection.GeneratedProtocolMessageType('Face', (_message.Message,), dict(
  DESCRIPTOR = _FACE,
  __module__ = 'face_pb2'
  # @@protoc_insertion_point(class_scope:flib.proto.Face)
  ))
_sym_db.RegisterMessage(Face)


# @@protoc_insertion_point(module_scope)